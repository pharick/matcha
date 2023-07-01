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

func UserList(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	users, err := env.Users.GetAll()
	if err != nil {
		return nil, err
	}
	usersRet := lib.Map(users, func(user models.User) schemas.UserReturn {
		return schemas.UserReturn{
			Id:        user.Id,
			Username:  user.Username,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Gender:    user.Gender,
			Biography: user.Biography,
		}
	})
	ret := schemas.UsersReturn{
		List: usersRet,
	}
	return ret, nil
}

func UserProfile(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	ret := schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Gender:    user.Gender,
		Biography: user.Biography,
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
	var d schemas.UpdateUserData
	err = lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	if d.Email != "" {
		user.Email = d.Email
		user.Active = false
	}
	if d.FirstName != "" {
		user.FirstName = d.FirstName
	}
	if d.LastName != "" {
		user.LastName = d.LastName
	}
	if d.Gender != "" {
		user.Gender = d.Gender
	}
	if d.Biography != "" {
		user.Biography = d.Biography
	}
	user, err = env.Users.Update(user)
	if err != nil {
		return nil, err
	}
	ret := schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Gender:    user.Gender,
		Biography: user.Biography,
	}
	return ret, nil
}
