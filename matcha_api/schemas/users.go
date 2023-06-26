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
