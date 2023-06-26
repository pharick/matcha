package schemas

type CurrenUserReturn struct {
	Id        int    `json:"id"`
	Username  string `json:"username"`
	Active    bool   `json:"active"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
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

type SendPasswordResetEmailData struct {
	Email string `json:"email" validate:"required"`
}

type PasswordResetData struct {
	Token    string `json:"token" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type PasswordChangeData struct {
	OldPassword string `json:"old_password" validate:"required"`
	NewPassword string `json:"new_password" validate:"required"`
}
