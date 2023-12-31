package lib

import (
	"encoding/json"
	"fmt"
	"matcha_api/models"
	"math/rand"
	"net/http"
	"strconv"
)

type MockUser struct {
	Gender string `json:"gender"`
	Name   struct {
		First string `json:"first"`
		Last  string `json:"last"`
	} `json:"name"`
	Email string `json:"email"`
	Login struct {
		Username string `json:"username"`
	} `json:"login"`
	Dob struct {
		Date string `json:"date"`
	} `json:"dob"`
	Location struct {
		Coordinates struct {
			Longitude string `json:"longitude"`
			Latitude  string `json:"latitude"`
		} `json:"coordinates"`
	} `json:"location"`
	Picture struct {
		Large string `json:"large"`
	} `json:"picture"`
}

var interests = []string{
	"reading",
	"cooking",
	"gardening",
	"sports",
	"hiking",
	"photography",
	"painting",
	"drawing",
	"music",
	"dancing",
	"traveling",
	"collecting",
	"yoga",
	"meditation",
	"fishing",
	"crafting",
	"volunteering",
	"gaming",
	"cycling",
	"bird_watching",
	"technology",
	"fashion",
	"writing",
	"diy",
	"home_improvement",
	"movies",
	"tv_shows",
	"pets",
	"sewing",
	"astrology",
	"fitness",
	"science",
	"foodie",
	"motorcycling",
	"graphic_novels",
	"reading_comics",
	"sculpting",
	"skydiving",
	"extreme_sports",
	"board_games",
	"investing",
	"finance",
	"antique_restoration",
	"magic",
	"illusions",
	"astronomy",
	"language_learning",
	"martial_arts",
}

var interestsN = 5

type RandomUserResponse struct {
	Results []MockUser `json:"results"`
}

func generateUser(users *models.UserModel) (*MockUser, error) {
	var data RandomUserResponse
	res, err := http.Get("https://randomuser.me/api/")
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	err = json.NewDecoder(res.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data.Results[0], err
}

func generateInterests() []string {
	checker := make(map[int]string)
	selected := make([]string, 0, interestsN)
	for len(selected) < interestsN {
		i := rand.Intn(len(interests))
		if _, exists := checker[i]; !exists {
			selected = append(selected, interests[i])
			checker[i] = interests[i]
		}
	}
	return selected

}

func GenerateUsers(
	users *models.UserModel,
	photos *models.PhotoModel,
	tags *models.TagModel,
	n int,
) error {
	for i := 0; i < n; i++ {
		mockUser, err := generateUser(users)
		if err != nil {
			return err
		}
		hash, err := HashPassword("Qwerty1!")
		if err != nil {
			return err
		}
		user, err := users.Create(
			mockUser.Login.Username,
			mockUser.Email,
			hash,
			mockUser.Name.First,
			mockUser.Name.Last,
			mockUser.Dob.Date,
		)
		if err != nil {
			return err
		}
		longitude, err := strconv.ParseFloat(mockUser.Location.Coordinates.Longitude, 64)
		if err != nil {
			return err
		}
		latitude, err := strconv.ParseFloat(mockUser.Location.Coordinates.Latitude, 64)
		if err != nil {
			return err
		}
		user.LastPosition = models.Position{
			Longitude: longitude,
			Latitude:  latitude,
		}
		user.Gender = mockUser.Gender
		user.Active = true
		user, err = users.Update(user)
		if err != nil {
			return err
		}
		_, err = photos.Create(user.Id, fmt.Sprintf("/mock/%s/%v.jpg", user.Gender, rand.Intn(111)+1))
		if err != nil {
			return err
		}
		_, err = tags.Set(user.Id, generateInterests())
		if err != nil {
			return err
		}
	}
	return nil
}
