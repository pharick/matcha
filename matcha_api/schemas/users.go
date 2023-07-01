package schemas

type UserReturn struct {
	Id        int    `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Gender    string `json:"gender"`
	Biography string `json:"biography"`
}

type UsersReturn struct {
	List []UserReturn `json:"list"`
}

type UpdateUserData struct {
	Email     string `json:"email" validate:"omitempty,email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Gender    string `json:"gender" validate:"omitempty,oneof=male female other"`
	Biography string `json:"biography"`
}
