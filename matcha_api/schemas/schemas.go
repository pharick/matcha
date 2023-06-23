package schemas

import "matcha_api/errors"

type ValidationErrorReturn struct {
	Errors []errors.ValidationError `json:"validation_errors"`
}

type UserReturn struct {
	Id        int    `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type UsersReturn struct {
	List []UserReturn `json:"list"`
}

type RegistrationData struct {
	Username  string `json:"username" validate:"required,lowercase"`
	Email     string `json:"email" validate:"required,email,lowercase"`
	Password  string `json:"password" validate:"required"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
}

type RegistrationReturn struct {
	Token string     `json:"token"`
	User  UserReturn `json:"user"`
}

type LoginData struct {
	Username string `json:"username" validate:"required,lowercase"`
	Password string `json:"password" validate:"required"`
}

type LoginReturn struct {
	Token string     `json:"token"`
	User  UserReturn `json:"user"`
}

type ActivationData struct {
	Token string `json:"token" validate:"required"`
}
