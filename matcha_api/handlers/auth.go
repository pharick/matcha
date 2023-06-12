package handlers

import (
	"encoding/json"
	"fmt"
	"matcha_api/lib"
	"matcha_api/models"
	"net/http"

	"github.com/go-playground/validator/v10"
)

type registrationData struct {
	Username  string `json:"username" validate:"required"`
	Email     string `json:"email" validate:"required"`
	Password  string `json:"password" validate:"required"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
}

type registrationReturn struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

type loginData struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func (env *Env) Register(w http.ResponseWriter, r *http.Request) {
	var d registrationData
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

	json.NewEncoder(w).Encode(registrationReturn{token, user})
}

func (env *Env) Login(w http.ResponseWriter, r *http.Request) {
	var d loginData
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

	user

	fmt.Println(d)
}
