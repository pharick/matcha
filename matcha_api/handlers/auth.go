package handlers

import (
	"encoding/json"
	"log"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"

	"github.com/go-playground/validator/v10"
)

func Register(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
	var d schemas.RegistrationData
	json.NewDecoder(r.Body).Decode(&d)
	validate := validator.New()
	err := validate.Struct(d)
	if err != nil {
		log.Println(err)
		return nil, HttpError{422}
	}
	_, err = env.Users.GetOneByUsername(d.Username)
	if err == nil {
		return nil, HttpError{409}
	}
	passwordHash, err := lib.HashPassword(d.Password)
	if err != nil {
		return nil, err
	}
	token, err := lib.GenerateJWT(d.Username, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	err = lib.SendActivationEmail(
		env.Settings.SMTPHost,
		env.Settings.SMTPPort,
		env.Settings.SMTPEmail,
		env.Settings.SMTPPassword,
		d.Email,
	)
	if err != nil {
		return nil, err
	}
	user, err := env.Users.Create(
		d.Username,
		d.Email,
		passwordHash,
		d.FirstName,
		d.LastName,
	)
	if err != nil {
		return nil, err
	}
	ret := schemas.RegistrationReturn{Token: token, User: schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}}
	return ret, nil
}

func Login(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
	var d schemas.LoginData
	json.NewDecoder(r.Body).Decode(&d)
	validate := validator.New()
	err := validate.Struct(d)
	if err != nil {
		return nil, HttpError{422}
	}
	user, err := env.Users.GetOneByUsername(d.Username)
	if err != nil {
		return nil, HttpError{401}
	}
	if !lib.CheckPasswordHash(d.Password, user.PasswordHash) {
		return nil, HttpError{401}
	}
	token, err := lib.GenerateJWT(user.Username, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	ret := schemas.RegistrationReturn{Token: token, User: schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}}
	return ret, nil
}

func WhoAmI(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
	user := r.Context().Value(ContextKey("User")).(models.User)
	ret := schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
	return ret, nil
}
