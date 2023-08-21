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
	Me                bool     `json:"me"`
	Liked             bool     `json:"liked"`
	Match             bool     `json:"match"`
	Avatar            string   `json:"avatar"`
	Rating            float64  `json:"rating"`
	Distance          float64  `json:"distance"`
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

type UpdatePositionData struct {
	Longitude float64 `json:"longitude" validate:"required"`
	Latitude  float64 `json:"latitude" validate:"required"`
}

type SearchData struct {
	AgeFrom     int      `json:"age_from" validate:"required"`
	AgeTo       int      `json:"age_to" validate:"required"`
	MinFame     int      `json:"min_fame" validate:"min=0"`
	MaxDistance int      `json:"max_distance" validate:"min=0"`
	Tags        []string `json:"tags" validate:"required"`
	SortField   string   `json:"sort_field" validate:"required"`
	SortType    string   `json:"sort_type" validate:"required,oneof=asc desc"`
	Offset      int      `json:"offset" validate:"min=0"`
	Limit       int      `json:"limit" validate:"min=0"`
	StartTime   string   `json:"start_time" validate:"required"`
}
