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
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	var d schemas.SearchData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
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
		})
	}
	ret := schemas.SearchReturn{
		List:  usersRet,
		Total: count,
	}
	return ret, nil
}

func UserProfile(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
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
	liked, err := env.Likes.IsExists(user.Id, currentUser.Id)
	if err != nil {
		return nil, err
	}
	match, err := env.Likes.IsMatch(user.Id, currentUser.Id)
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
		Me:                user.Id == currentUser.Id,
		Liked:             liked,
		Match:             match,
		Avatar:            avatar_url,
		Rating:            lib.NormalizeRating(&env.Users, user.Rating),
		Distance:          lib.CalcDistance(currentUser.LastPosition, user.LastPosition),
		Online:            env.NotificationsHub.IsUserOnline(user.Id),
		LastOnline:        user.LastOnline,
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
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	if currentUser.Username != user.Username {
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
