package models

import "database/sql"

type User struct {
	Id        int    `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type UserModel struct {
	DB *sql.DB
}

func (m UserModel) Create(
	username string,
	email string,
	passwordHash string,
	firstName string,
	lastName string,
) (User, error) {
	var user User
	err := m.DB.QueryRow(
		`INSERT INTO users(username, email, password_hash, first_name, last_name, active) 
		VALUES($1, $2, $3, $4, $5, false) RETURNING id, username, email, first_name, last_name`,
		username, email, passwordHash, firstName, lastName,
	).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.FirstName,
		&user.LastName,
	)
	return user, err
}

func (m UserModel) GetOneById(id int) (User, error) {
	var user User
	err := m.DB.QueryRow("SELECT id, username, email, first_name, last_name FROM users WHERE id = $1", id).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.FirstName,
		&user.LastName,
	)
	return user, err
}

func (m UserModel) GetOneByUsername(username string) (User, error) {
	var user User
	err := m.DB.QueryRow("SELECT id, username, email, first_name, last_name FROM users WHERE username = $1", username).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.FirstName,
		&user.LastName,
	)
	return user, err
}
