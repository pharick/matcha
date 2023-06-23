package handlers

import (
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"
)

func Register(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
	var d schemas.RegistrationData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	errs := env.Users.CheckConflicts(d.Username, d.Email)
	if errs != nil {
		return nil, errors.HttpValidationError{Status: 409, Errors: errs}
	}
	passwordHash, err := lib.HashPassword(d.Password)
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
	activation_token, err := lib.GenerateActivationJWT(user.Email, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	err = lib.SendActivationEmail(
		env.Settings.SMTPHost,
		env.Settings.SMTPPort,
		env.Settings.SMTPEmail,
		env.Settings.SMTPPassword,
		d.Email,
		activation_token,
	)
	if err != nil {
		return nil, err
	}
	token, err := lib.GenerateAuthJWT(d.Username, env.Settings.JWTSecret)
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

func Activate(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
	var d schemas.ActivationData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	email, err := lib.ParseJWTSub(d.Token, env.Settings.JWTSecret)
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	user := r.Context().Value(ContextKey("User")).(models.User)
	if user.Email != email {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	user.Active = true
	user, err = env.Users.Update(user)
	if err != nil {
		return nil, err
	}
	return map[string]string{}, nil
}

func Login(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
	var d schemas.LoginData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	user, err := env.Users.GetOneByUsername(d.Username)
	if err != nil {
		return nil, errors.HttpError{Status: 401, Body: nil}
	}
	if !lib.CheckPasswordHash(d.Password, user.PasswordHash) {
		return nil, errors.HttpError{Status: 401, Body: nil}
	}
	token, err := lib.GenerateAuthJWT(user.Username, env.Settings.JWTSecret)
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
