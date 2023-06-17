package schemas

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
	Username  string `json:"username" validate:"required"`
	Email     string `json:"email" validate:"required"`
	Password  string `json:"password" validate:"required"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
}

type RegistrationReturn struct {
	Token string     `json:"token"`
	User  UserReturn `json:"user"`
}

type LoginData struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginReturn struct {
	Token string     `json:"token"`
	User  UserReturn `json:"user"`
}
