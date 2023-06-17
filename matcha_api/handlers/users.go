package handlers

import (
	"database/sql"
	"encoding/json"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"

	"goji.io/pat"
)

func UserList(env *Env, w http.ResponseWriter, r *http.Request) error {
	users, err := env.Users.GetAll()
	if err != nil {
		return err
	}
	usersRet := lib.Map(users, func(user models.User) schemas.UserReturn {
		return schemas.UserReturn{
			Id:        user.Id,
			Username:  user.Username,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
		}
	})
	ret := schemas.UsersReturn{
		List: usersRet,
	}
	json.NewEncoder(w).Encode(ret)
	return nil
}

func UserProfile(env *Env, w http.ResponseWriter, r *http.Request) error {
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return HttpError{404}
	}
	if err != nil {
		return err
	}
	ret := schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
	json.NewEncoder(w).Encode(ret)
	return nil
}
