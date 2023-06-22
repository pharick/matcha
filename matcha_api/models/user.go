package models

import (
	"database/sql"
)

type User struct {
	Id           int
	Username     string
	Email        string
	Active       bool
	PasswordHash string
	FirstName    string
	LastName     string
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
		VALUES($1, $2, $3, $4, $5, false) RETURNING id, username, email, active, password_hash, first_name, last_name`,
		username, email, passwordHash, firstName, lastName,
	).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
	)
	return user, err
}

func (m UserModel) GetAll() ([]User, error) {
	users := make([]User, 0)
	rows, err := m.DB.Query("SELECT id, username, email, active, password_hash, first_name, last_name FROM users")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.Id,
			&user.Username,
			&user.Email,
			&user.Active,
			&user.PasswordHash,
			&user.FirstName,
			&user.LastName,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetAllActive() ([]User, error) {
	users := make([]User, 0)
	rows, err := m.DB.Query("SELECT id, username, email, active, password_hash, first_name, last_name FROM users WHERE active = true")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.Id,
			&user.Username,
			&user.Email,
			&user.Active,
			&user.PasswordHash,
			&user.FirstName,
			&user.LastName,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetOneByUsername(username string) (User, error) {
	var user User
	err := m.DB.QueryRow("SELECT id, username, email, active, password_hash, first_name, last_name FROM users WHERE username = $1", username).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
	)
	return user, err
}

func (m UserModel) GetOneActiveByUsername(username string) (User, error) {
	var user User
	err := m.DB.QueryRow("SELECT id, username, email, active, password_hash, first_name, last_name FROM users WHERE username = $1 AND active = true", username).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
	)
	return user, err
}
