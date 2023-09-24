package handlers

import (
	"database/sql"
	"fmt"
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"
	"strconv"

	"goji.io/pat"
)

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
	blocked, err := env.Blocks.IsExists(currentUser.Id, user.Id)
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
		Online:            env.NotificationsHub.IsUserOnline(fmt.Sprintf("%v", user.Id)),
		LastOnline:        user.LastOnline,
		Blocked:           blocked,
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

//likes

func GetLikesByUsers(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	users, err := env.Users.GetLikesByUserId(currentUser.Id, offset, limit)
	if err != nil {
		return nil, err
	}
	count, err := env.Users.CountLikesByUserId(currentUser.Id)
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

func GetLikesByMe(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	users, err := env.Users.GetLikesByFromUserId(currentUser.Id, offset, limit)
	if err != nil {
		return nil, err
	}
	count, err := env.Users.CountLikesByFromUserId(currentUser.Id)
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

// visits

func GetVisitsByUsers(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	users, err := env.Users.GetVisitsByUserId(currentUser.Id, offset, limit)
	if err != nil {
		return nil, err
	}
	count, err := env.Users.CountVisitsByUserId(currentUser.Id)
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

func GetVisitsByMe(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	users, err := env.Users.GetVisitsByFromUserId(currentUser.Id, offset, limit)
	if err != nil {
		return nil, err
	}
	count, err := env.Users.CountVisitsByFromUserId(currentUser.Id)
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

//chat

func GetChatMessageUsers(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	users, err := env.Users.GetAllMessageUsers(currentUser.Id)
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
		List: usersRet,
	}
	return ret, nil
}
