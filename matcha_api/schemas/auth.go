package schemas

type CurrenUserReturn struct {
	Id                int      `json:"id"`
	Username          string   `json:"username"`
	Active            bool     `json:"active"`
	Email             string   `json:"email"`
	FirstName         string   `json:"first_name"`
	LastName          string   `json:"last_name"`
	Gender            string   `json:"gender"`
	GenderPreferences []string `json:"gender_preferences"`
	Biography         string   `json:"biography"`
	Tags              []string `json:"tags"`
}

type RegistrationData struct {
	Username  string `json:"username" validate:"required,lowercase,alpha,min=2,max=16"`
	Email     string `json:"email" validate:"required,email,lowercase"`
	Password  string `json:"password" validate:"required,min=6,max=36,containsany=abcdefghijklmnopqrstuvwxyz,containsany=ABCDEFGHIJKLMNOPQRSTUVWXYZ,containsany=.#!$%^&*;:{}-_~()"`
	FirstName string `json:"first_name" validate:"required,alpha,min=2,max=16"`
	LastName  string `json:"last_name" validate:"required,alpha,min=2,max=16"`
	BirthDate string `json:"birth_date" validate:"required,datetime=2006-01-02"`
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
