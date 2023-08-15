package handlers

import (
	"database/sql"
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"

	"goji.io/pat"
)

func UserSearch(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	users, err := env.Users.Search()
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
		})
	}
	ret := schemas.UsersReturn{
		List: usersRet,
	}
	return ret, nil
}

func UserProfile(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	current_user := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneActiveByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	tags, err := env.Tags.GetAllByUserId(user.Id)
	if err != nil {
		return nil, err
	}
	liked, err := env.Likes.IsExists(user.Id, current_user.Id)
	if err != nil {
		return nil, err
	}
	match, err := env.Likes.IsMatch(user.Id, current_user.Id)
	if err != nil {
		return nil, err
	}
	avatar, err := env.Photos.GetFirstByUserId(user.Id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	var avatar_url string
	if err != sql.ErrNoRows {
		avatar_url = avatar.Url
	}
	maxRating, err := env.Users.GetMaxRating()
	if err != nil {
		return nil, err
	}
	var rating float64
	if maxRating == 0 {
		rating = 0
	} else {
		rating = float64(user.Rating) / float64(maxRating) * 5.0
	}
	ret := schemas.UserReturn{
		Id:                user.Id,
		Username:          user.Username,
		Email:             user.Email,
		FirstName:         user.FirstName,
		LastName:          user.LastName,
		Gender:            user.Gender,
		GenderPreferences: user.GenderPreferences,
		Biography:         user.Biography,
		BirthDate:         user.BirthDate,
		Tags:              tags,
		Me:                user.Id == current_user.Id,
		Liked:             liked,
		Match:             match,
		Avatar:            avatar_url,
		Rating:            rating,
	}
	return ret, nil
}

func UpdateUser(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	current_user := r.Context().Value(ContextKey("User")).(models.User)
	if current_user.Username != user.Username {
		return nil, errors.HttpError{Status: 403, Body: nil}
	}
	var d schemas.UpdateUserData
	err = lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	user.FirstName = d.FirstName
	user.LastName = d.LastName
	user.Gender = d.Gender
	user.GenderPreferences = d.GenderPreferences
	user.Biography = d.Biography
	user, err = env.Users.Update(user)
	if err != nil {
		return nil, err
	}
	tags, err := env.Tags.Set(user.Id, d.Tags)
	if err != nil {
		return nil, err
	}
	ret := schemas.UserReturn{
		Id:                user.Id,
		Username:          user.Username,
		Email:             user.Email,
		FirstName:         user.FirstName,
		LastName:          user.LastName,
		Gender:            user.Gender,
		GenderPreferences: user.GenderPreferences,
		Biography:         user.Biography,
		BirthDate:         user.BirthDate,
		Tags:              tags,
	}
	return ret, nil
}

func UpdatePosition(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.UpdatePositionData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	user := r.Context().Value(ContextKey("User")).(models.User)
	user.LastPosition.Longitude = d.Longitude
	user.LastPosition.Latitude = d.Latitude
	user, err = env.Users.Update(user)
	return nil, err
}
