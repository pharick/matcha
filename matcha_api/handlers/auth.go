package handlers

import (
	"encoding/json"
	"matcha_api/lib"
	"matcha_api/schemas"
	"net/http"

	"github.com/go-playground/validator/v10"
)

func (env *Env) Register(w http.ResponseWriter, r *http.Request) {
	var d schemas.RegistrationData
	json.NewDecoder(r.Body).Decode(&d)

	validate := validator.New()
	err := validate.Struct(d)
	if err != nil {
		handleError(w, err, 422)
		return
	}

	_, err = env.Users.GetOneByUsername(d.Username)
	if err == nil {
		handleError(w, err, 409)
		return
	}

	passwordHash, err := lib.HashPassword(d.Password)
	if err != nil {
		handleError(w, err, 500)
		return
	}
	user, err := env.Users.Create(
		d.Username,
		d.Email,
		passwordHash,
		d.FirstName,
		d.LastName,
	)
	if err != nil {
		handleError(w, err, 500)
		return
	}

	token, err := lib.GenerateJWT(user.Username, env.Settings.JWTSecret)
	if err != nil {
		handleError(w, err, 500)
		return
	}

	ret := schemas.RegistrationReturn{Token: token, User: schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}}
	json.NewEncoder(w).Encode(ret)
}

func (env *Env) Login(w http.ResponseWriter, r *http.Request) {
	var d schemas.LoginData
	json.NewDecoder(r.Body).Decode(&d)

	validate := validator.New()
	err := validate.Struct(d)
	if err != nil {
		handleError(w, err, 422)
		return
	}

	user, err := env.Users.GetOneByUsername(d.Username)
	if err != nil {
		handleError(w, err, 401)
		return
	}

	if !lib.CheckPasswordHash(d.Password, user.PasswordHash) {
		handleError(w, err, 401)
		return
	}

	token, err := lib.GenerateJWT(user.Username, env.Settings.JWTSecret)
	if err != nil {
		handleError(w, err, 500)
		return
	}

	ret := schemas.RegistrationReturn{Token: token, User: schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}}
	json.NewEncoder(w).Encode(ret)
}
