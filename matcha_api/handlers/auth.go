package handlers

import (
	"database/sql"
	"fmt"
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"
)

func Register(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
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
		d.BirthDate,
	)
	if err != nil {
		return nil, err
	}
	activation_token, err := lib.GenerateActivationJWT(user.Email, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	err = lib.SendEmail(
		env.Settings.SMTPHost,
		env.Settings.SMTPPort,
		env.Settings.SMTPEmail,
		env.Settings.SMTPPassword,
		user.Email,
		"Matcha email verification",
		fmt.Sprintf(
			"Follow this link to verify your email:\n%s/activate?token=%s",
			env.Settings.FrontBaseUrl, activation_token,
		),
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
		BirthDate: user.BirthDate,
	}}
	return ret, nil
}

func Activate(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.ActivationData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	email, target, err := lib.ParseJWT(d.Token, env.Settings.JWTSecret)
	if err != nil || target != "activation" {
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
	return nil, nil
}

func SendActivationEmail(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	user := r.Context().Value(ContextKey("User")).(models.User)
	if user.Active {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	activation_token, err := lib.GenerateActivationJWT(user.Email, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	err = lib.SendEmail(
		env.Settings.SMTPHost,
		env.Settings.SMTPPort,
		env.Settings.SMTPEmail,
		env.Settings.SMTPPassword,
		user.Email,
		"Matcha email verification",
		fmt.Sprintf(
			"Follow this link to verify your email:\n%s/activate?token=%s",
			env.Settings.FrontBaseUrl, activation_token,
		),
	)
	if err != nil {
		return nil, err
	}
	return nil, nil
}

func SendPasswordResetEmail(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.SendPasswordResetEmailData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	user, err := env.Users.GetOneByEmail(d.Email)
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	reset_token, err := lib.GeneratePasswordResetJWT(user.Username, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	err = lib.SendEmail(
		env.Settings.SMTPHost,
		env.Settings.SMTPPort,
		env.Settings.SMTPEmail,
		env.Settings.SMTPPassword,
		user.Email,
		"Matcha password reset",
		fmt.Sprintf(
			"Follow this link to reset your password:\n%s/resetpassword?token=%s",
			env.Settings.FrontBaseUrl, reset_token,
		),
	)
	if err != nil {
		return nil, err
	}
	return nil, nil
}

func PasswordReset(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.PasswordResetData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	username, target, err := lib.ParseJWT(d.Token, env.Settings.JWTSecret)
	if err != nil || target != "reset" {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	user, err := env.Users.GetOneByUsername(username)
	if err != nil {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	passwordHash, err := lib.HashPassword(d.Password)
	if err != nil {
		return nil, err
	}
	user.PasswordHash = passwordHash
	user, err = env.Users.Update(user)
	if err != nil {
		return nil, err
	}
	return nil, nil
}

func PasswordChange(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.PasswordChangeData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	user := r.Context().Value(ContextKey("User")).(models.User)
	if !lib.CheckPasswordHash(d.OldPassword, user.PasswordHash) {
		return nil, errors.HttpError{Status: 401, Body: nil}
	}
	passwordHash, err := lib.HashPassword(d.NewPassword)
	if err != nil {
		return nil, err
	}
	user.PasswordHash = passwordHash
	user, err = env.Users.Update(user)
	if err != nil {
		return nil, err
	}
	return nil, nil
}

func EmailChange(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.ChangeEmailData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	user := r.Context().Value(ContextKey("User")).(models.User)
	if !lib.CheckPasswordHash(d.Password, user.PasswordHash) {
		return nil, errors.HttpError{Status: 403, Body: nil}
	}
	user.Email = d.Email
	user.Active = false
	user, err = env.Users.Update(user)
	if err != nil {
		return nil, err
	}
	activation_token, err := lib.GenerateActivationJWT(user.Email, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	err = lib.SendEmail(
		env.Settings.SMTPHost,
		env.Settings.SMTPPort,
		env.Settings.SMTPEmail,
		env.Settings.SMTPPassword,
		user.Email,
		"Matcha email verification",
		fmt.Sprintf(
			"Follow this link to verify your email:\n%s/activate?token=%s",
			env.Settings.FrontBaseUrl, activation_token,
		),
	)
	if err != nil {
		return nil, err
	}
	return nil, nil
}

func Login(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.LoginData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	user, err := env.Users.GetOneByUsername(d.Username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 401, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	if !lib.CheckPasswordHash(d.Password, user.PasswordHash) {
		return nil, errors.HttpError{Status: 401, Body: nil}
	}
	token, err := lib.GenerateAuthJWT(user.Username, env.Settings.JWTSecret)
	if err != nil {
		return nil, err
	}
	http.SetCookie(w, &http.Cookie{Name: "token", Value: token})
	ret := schemas.LoginReturn{Token: token, User: schemas.UserReturn{
		Id:                user.Id,
		Username:          user.Username,
		Email:             user.Email,
		FirstName:         user.FirstName,
		LastName:          user.LastName,
		BirthDate:         user.BirthDate,
		Biography:         user.Biography,
		Gender:            user.Gender,
		GenderPreferences: user.GenderPreferences,
	}}
	return ret, nil
}

func WhoAmI(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	user := r.Context().Value(ContextKey("User")).(models.User)
	tags, err := env.Tags.GetAllByUserId(user.Id)
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
	ret := schemas.CurrenUserReturn{
		Id:                user.Id,
		Username:          user.Username,
		Active:            user.Active,
		Email:             user.Email,
		FirstName:         user.FirstName,
		LastName:          user.LastName,
		Gender:            user.Gender,
		GenderPreferences: user.GenderPreferences,
		Biography:         user.Biography,
		Tags:              tags,
		Avatar:            avatar_url,
	}
	return ret, nil
}
