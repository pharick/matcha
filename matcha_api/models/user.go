package models

import (
	"database/sql"
	"matcha_api/errors"
)

type User struct {
	Id           int
	Username     string
	Email        string
	Active       bool
	PasswordHash string
	FirstName    string
	LastName     string
	Gender       string
	Biography    string
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
	var gender sql.NullString
	var biography sql.NullString
	err := m.DB.QueryRow(
		`INSERT INTO users(username, email, password_hash, first_name, last_name) 
		VALUES($1, $2, $3, $4, $5) 
		RETURNING id, username, email, active, password_hash, first_name, last_name, gender, biography`,
		username, email, passwordHash, firstName, lastName,
	).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&gender,
		&biography,
	)
	user.Gender = gender.String
	user.Biography = biography.String
	return user, err
}

func (m UserModel) CheckConflicts(username string, email string) []errors.ValidationError {
	errs := make([]errors.ValidationError, 0)
	_, err := m.GetOneByUsername(username)
	if err == nil {
		errs = append(errs, errors.ValidationError{Field: "username", Tag: "conflict"})
	}
	_, err = m.GetOneByEmail(email)
	if err == nil {
		errs = append(errs, errors.ValidationError{Field: "email", Tag: "conflict"})
	}
	if len(errs) > 0 {
		return errs
	}
	return nil
}

func (m UserModel) Update(
	d User,
) (User, error) {
	var user User
	var gender sql.NullString
	var biography sql.NullString
	err := m.DB.QueryRow(
		`UPDATE users SET username = $2, email = $3, active = $4, password_hash = $5, 
		first_name = $6, last_name = $7, gender = $8, biography = $9 
		WHERE id = $1
		RETURNING id, username, email, active, password_hash, first_name, last_name, gender, biography`,
		d.Id, d.Username, d.Email, d.Active, d.PasswordHash, d.FirstName, d.LastName, d.Gender, d.Biography,
	).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&gender,
		&biography,
	)
	user.Gender = gender.String
	user.Biography = biography.String
	return user, err
}

func (m UserModel) GetAll() ([]User, error) {
	users := make([]User, 0)
	rows, err := m.DB.Query("SELECT id, username, email, active, password_hash, first_name, last_name, gender, biography  FROM users")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var user User
		var gender sql.NullString
		var biography sql.NullString
		err := rows.Scan(
			&user.Id,
			&user.Username,
			&user.Email,
			&user.Active,
			&user.PasswordHash,
			&user.FirstName,
			&user.LastName,
			&gender,
			&biography,
		)
		if err != nil {
			return nil, err
		}
		user.Gender = gender.String
		user.Biography = biography.String
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetAllActive() ([]User, error) {
	users := make([]User, 0)
	rows, err := m.DB.Query("SELECT id, username, email, active, password_hash, first_name, last_name, gender, biography FROM users WHERE active = true")
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var user User
		var gender sql.NullString
		var biography sql.NullString
		err := rows.Scan(
			&user.Id,
			&user.Username,
			&user.Email,
			&user.Active,
			&user.PasswordHash,
			&user.FirstName,
			&user.LastName,
			&gender,
			&biography,
		)
		if err != nil {
			return nil, err
		}
		user.Gender = gender.String
		user.Biography = biography.String
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetOneByUsername(username string) (User, error) {
	var user User
	var gender sql.NullString
	var biography sql.NullString
	err := m.DB.QueryRow("SELECT id, username, email, active, password_hash, first_name, last_name, gender, biography FROM users WHERE username = $1", username).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&gender,
		&biography,
	)
	user.Gender = gender.String
	user.Biography = biography.String
	return user, err
}

func (m UserModel) GetOneActiveByUsername(username string) (User, error) {
	var user User
	var gender sql.NullString
	var biography sql.NullString
	err := m.DB.QueryRow("SELECT id, username, email, active, password_hash, first_name, last_name, gender, biography FROM users WHERE username = $1 AND active = true", username).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&gender,
		&biography,
	)
	user.Gender = gender.String
	user.Biography = biography.String
	return user, err
}

func (m UserModel) GetOneByEmail(email string) (User, error) {
	var user User
	var gender sql.NullString
	var biography sql.NullString
	err := m.DB.QueryRow("SELECT id, username, email, active, password_hash, first_name, last_name, gender, biography FROM users WHERE email = $1", email).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&gender,
		&biography,
	)
	user.Gender = gender.String
	user.Biography = biography.String
	return user, err
}

func (m UserModel) GetOneActiveByEmail(email string) (User, error) {
	var user User
	var gender sql.NullString
	var biography sql.NullString
	err := m.DB.QueryRow("SELECT id, username, email, active, password_hash, first_name, last_name, gender, biography FROM users WHERE email = $1 AND active = true", email).Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&gender,
		&biography,
	)
	user.Gender = gender.String
	user.Biography = biography.String
	return user, err
}
