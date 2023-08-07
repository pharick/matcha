package lib

import (
	"encoding/json"
	"log"
	"matcha_api/models"
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
}

type RandomUserResponse struct {
	Results []MockUser `json:"results"`
}

func GenerateUser(users *models.UserModel) (*MockUser, error) {
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

func GenerateUsers(users *models.UserModel, n int) error {
	for i := 0; i < n; i++ {
		mockUser, err := GenerateUser(users)
		log.Println(mockUser)
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
		user, err = users.Update(user)
		if err != nil {
			return err
		}
	}
	return nil
}
