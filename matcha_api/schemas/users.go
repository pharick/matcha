package schemas

type UserReturn struct {
	Id                int      `json:"id"`
	Username          string   `json:"username"`
	Email             string   `json:"email"`
	FirstName         string   `json:"first_name"`
	LastName          string   `json:"last_name"`
	Gender            string   `json:"gender"`
	GenderPreferences []string `json:"gender_preferences"`
	Biography         string   `json:"biography"`
	Tags              []string `json:"tags"`
}

type UsersReturn struct {
	List []UserReturn `json:"list"`
}

type UpdateUserData struct {
	FirstName         string   `json:"first_name" validate:"required"`
	LastName          string   `json:"last_name" validate:"required"`
	Gender            string   `json:"gender" validate:"required,oneof=male female other"`
	GenderPreferences []string `json:"gender_preferences" validate:"required,dive,oneof=male female other"`
	Biography         string   `json:"biography"`
	Tags              []string `json:"tags" validate:"required"`
}
