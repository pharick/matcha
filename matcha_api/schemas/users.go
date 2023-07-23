package schemas

type UserReturn struct {
	Id                int      `json:"id"`
	Username          string   `json:"username"`
	Email             string   `json:"email"`
	FirstName         string   `json:"first_name"`
	LastName          string   `json:"last_name"`
	BirthDate         string   `json:"birth_date"`
	Gender            string   `json:"gender"`
	GenderPreferences []string `json:"gender_preferences"`
	Biography         string   `json:"biography"`
	Tags              []string `json:"tags"`
}

type UsersReturn struct {
	List []UserReturn `json:"list"`
}

type UpdateUserData struct {
	FirstName         string   `json:"first_name" validate:"required,alpha,min=2,max=16"`
	LastName          string   `json:"last_name" validate:"required,alpha,min=2,max=16"`
	Gender            string   `json:"gender" validate:"required,oneof=male female other"`
	GenderPreferences []string `json:"gender_preferences" validate:"required,dive,oneof=male female other"`
	Biography         string   `json:"biography"`
	Tags              []string `json:"tags" validate:"required"`
}

type ChangeEmailData struct {
	Email    string `json:"email" validate:"required,email,lowercase"`
	Password string `json:"password" validate:"required"`
}
