package models

import "database/sql"

type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
	Name     string `json:"name"`
}

type UserModel struct {
	DB *sql.DB
}

func (m UserModel) GetOneByUsername(username string) (User, error) {
	var user User
	err := m.DB.QueryRow("SELECT * FROM users WHERE username = $1", username).Scan(
		&user.Id,
		&user.Username,
		&user.Name,
	)
	return user, err
}
