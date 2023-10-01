package handlers

import (
	"database/sql"
	"log"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"
)

func Search(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	var d schemas.SearchData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	log.Printf("search: %v", d)
	count, err := env.Users.SearchTotal(
		currentUser,
		d.AgeFrom,
		d.AgeTo,
		d.MinFame,
		d.MaxDistance,
		d.StartTime,
	)
	if err != nil {
		return nil, err
	}
	users, err := env.Users.Search(
		currentUser,
		d.AgeFrom,
		d.AgeTo,
		d.MinFame,
		d.MaxDistance,
		d.Tags,
		d.SortField,
		d.SortType,
		d.Offset,
		d.Limit,
		d.StartTime,
	)
	if err != nil {
		return nil, err
	}
	usersRet := make([]schemas.UserReturn, 0, len(users))
	for _, user := range users {
		avatar, err := env.Photos.GetFirstByUserId(user.Id)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		var avatar_url string
		if err != sql.ErrNoRows {
			avatar_url = avatar.Url
		}
		tags, err := env.Tags.GetAllByUserId(user.Id)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		usersRet = append(usersRet, schemas.UserReturn{
			Id:                user.Id,
			Username:          user.Username,
			Email:             user.Email,
			FirstName:         user.FirstName,
			LastName:          user.LastName,
			Gender:            user.Gender,
			GenderPreferences: user.GenderPreferences,
			Biography:         user.Biography,
			BirthDate:         user.BirthDate,
			Avatar:            avatar_url,
			Rating:            lib.NormalizeRating(&env.Users, user.Rating),
			Distance:          lib.CalcDistance(currentUser.LastPosition, user.LastPosition),
			Tags:              tags,
		})
	}
	ret := schemas.SearchReturn{
		List:  usersRet,
		Total: count,
	}
	return ret, nil
}
