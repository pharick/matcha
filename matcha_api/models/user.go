package models

import (
	"database/sql"
	"fmt"
	"matcha_api/errors"

	"github.com/lib/pq"
)

type Position struct {
	Longitude float64
	Latitude  float64
}

type User struct {
	Id                int
	Username          string
	Email             string
	Active            bool
	PasswordHash      string
	FirstName         string
	LastName          string
	BirthDate         string
	Gender            string
	GenderPreferences []string
	Biography         string
	LastPosition      Position
}

type UserModel struct {
	DB *sql.DB
}

var fields = `
	id, username, email, active, password_hash, first_name, last_name, birth_date,
	gender, gender_preferences::text[], biography, last_position[0], last_position[1]
`

func scanRow(row interface{ Scan(...any) error }, user *User) error {
	var gender sql.NullString
	var biography sql.NullString
	err := row.Scan(
		&user.Id,
		&user.Username,
		&user.Email,
		&user.Active,
		&user.PasswordHash,
		&user.FirstName,
		&user.LastName,
		&user.BirthDate,
		&gender,
		(*pq.StringArray)(&user.GenderPreferences),
		&biography,
		&user.LastPosition.Longitude,
		&user.LastPosition.Latitude,
	)
	if err != nil {
		return err
	}
	user.Gender = gender.String
	user.Biography = biography.String
	return nil
}

func (m UserModel) Create(
	username string,
	email string,
	passwordHash string,
	firstName string,
	lastName string,
	birthDate string,
) (User, error) {
	var user User
	row := m.DB.QueryRow(
		fmt.Sprintf(`
			INSERT INTO users(username, email, password_hash, first_name, last_name, birth_date)
			VALUES($1, $2, $3, $4, $5, $6)
			RETURNING %s
		`, fields),
		username, email, passwordHash, firstName, lastName, birthDate,
	)
	err := scanRow(row, &user)
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
	query := fmt.Sprintf(`
		UPDATE users
		SET username = $2, email = $3, active = $4, password_hash = $5,
		first_name = $6, last_name = $7, gender = $8, gender_preferences = $9,
		biography = $10, last_position = ('(' || $11 || ',' || $12 || ')')::point
		WHERE id = $1
		RETURNING %s
	`, fields)

	var row *sql.Row
	if len(d.Gender) > 0 {
		row = m.DB.QueryRow(
			query,
			d.Id, d.Username, d.Email, d.Active, d.PasswordHash, d.FirstName, d.LastName,
			d.Gender, pq.Array(d.GenderPreferences), d.Biography,
			d.LastPosition.Longitude, d.LastPosition.Latitude,
		)
	} else {
		row = m.DB.QueryRow(
			query,
			d.Id, d.Username, d.Email, d.Active, d.PasswordHash, d.FirstName, d.LastName,
			nil, pq.Array(d.GenderPreferences), d.Biography,
			d.LastPosition.Longitude, d.LastPosition.Latitude,
		)
	}
	err := scanRow(row, &user)
	return user, err
}

func (m UserModel) GetAll() ([]User, error) {
	var user User
	rows, err := m.DB.Query(
		fmt.Sprintf("SELECT %s FROM users", fields),
	)
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	for rows.Next() {
		err := scanRow(rows, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetAllActive() ([]User, error) {
	var user User
	rows, err := m.DB.Query(
		fmt.Sprintf("SELECT %s FROM users WHERE active = true", fields),
	)
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	for rows.Next() {
		err := scanRow(rows, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetOneByUsername(username string) (User, error) {
	var user User
	row := m.DB.QueryRow(
		fmt.Sprintf("SELECT %s FROM users WHERE username = $1", fields),
		username,
	)
	err := scanRow(row, &user)
	return user, err
}

func (m UserModel) GetOneActiveByUsername(username string) (User, error) {
	var user User
	row := m.DB.QueryRow(
		fmt.Sprintf("SELECT %s FROM users WHERE username = $1 AND active = true", fields),
		username,
	)
	err := scanRow(row, &user)
	return user, err
}

func (m UserModel) GetOneByEmail(email string) (User, error) {
	var user User
	row := m.DB.QueryRow(
		fmt.Sprintf("SELECT %s FROM users WHERE email = $1", fields),
		email,
	)
	err := scanRow(row, &user)
	return user, err
}

func (m UserModel) GetOneActiveByEmail(email string) (User, error) {
	var user User
	row := m.DB.QueryRow(
		fmt.Sprintf("SELECT %s FROM users WHERE email = $1 AND active = true", fields),
		email,
	)
	err := scanRow(row, &user)
	return user, err
}
