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
	Rating            int
	LastPosition      Position
	LastOnline        string
}

type UserModel struct {
	DB *sql.DB
}

var fields = `
	users.id, username, email, active, password_hash, first_name, last_name, birth_date,
	gender, gender_preferences::text[], biography, rating, last_position[0], last_position[1], last_online
`

var searchQuery = `
	id <> $1 AND updated_at < $2 AND
	$3 = ANY(gender_preferences) AND gender = ANY($4) AND
	date_part('year', age(birth_date)) >= $5 AND date_part('year', age(birth_date)) <= $6 AND
	rating >= $7 * (SELECT MAX(rating) FROM users) / 5.0 AND
	calc_distance(last_position, ('(' || $8 || ',' || $9 || ')')::point) <= $10 * 1000 AND
	(SELECT COUNT(1) FROM likes WHERE from_user_id = $1 AND user_id = users.id) <= 0 AND
	(SELECT COUNT(1) FROM blocks WHERE (from_user_id = $1 AND user_id = users.id) OR (from_user_id = users.id AND user_id = $1)) <= 0
`

func scanRow(row interface{ Scan(...any) error }, user *User) error {
	var gender sql.NullString
	var biography sql.NullString
	var rating sql.NullInt32
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
		&rating,
		&user.LastPosition.Longitude,
		&user.LastPosition.Latitude,
		&user.LastOnline,
	)
	if err != nil {
		return err
	}
	user.Gender = gender.String
	user.Biography = biography.String
	user.Rating = int(rating.Int32)
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

func (m UserModel) SearchTotal(
	currentUser User,
	ageFrom int,
	ageTo int,
	minRating int,
	maxDistance int,
	startTime string,
) (int, error) {
	var count int
	err := m.DB.QueryRow(
		fmt.Sprintf("SELECT COUNT(1) FROM users WHERE %s", searchQuery),
		currentUser.Id,
		startTime,
		currentUser.Gender,
		pq.Array(currentUser.GenderPreferences),
		ageFrom,
		ageTo,
		minRating,
		currentUser.LastPosition.Longitude,
		currentUser.LastPosition.Latitude,
		maxDistance,
	).Scan(&count)
	return count, err
}

func (m UserModel) Search(
	currentUser User,
	ageFrom int,
	ageTo int,
	minRating int,
	maxDistance int,
	tags []string,
	sortField string,
	sortType string,
	offset int,
	limit int,
	startTime string,
) ([]User, error) {
	var sortQuery string
	if sortField == "age" && sortType == "asc" {
		sortQuery = "birth_date DESC"
	} else if sortField == "age" && sortType == "desc" {
		sortQuery = "birth_date ASC"
	} else if sortField == "fame_rating" {
		sortQuery = fmt.Sprintf("rating %s", sortType)
	} else if sortField == "specific_interests" {
		sortQuery = fmt.Sprintf("coalesce(array_length(array_intersect($13, ARRAY(SELECT tags.name FROM users_tags JOIN tags ON users_tags.tag_id = tags.id WHERE users_tags.user_id = users.id)), 1), 0) %s", sortType)
	} else {
		sortQuery = fmt.Sprintf("calc_distance(last_position, ('(' || $8 || ',' || $9 || ')')::point) %s", sortType)
	}
	var user User
	var rows *sql.Rows
	var err error
	if sortField == "specific_interests" {
		rows, err = m.DB.Query(
			fmt.Sprintf(`
				SELECT %s FROM users
				WHERE %s
				ORDER BY %s, id OFFSET $11 LIMIT $12
			`, fields, searchQuery, sortQuery),
			currentUser.Id,
			startTime,
			currentUser.Gender,
			pq.Array(currentUser.GenderPreferences),
			ageFrom,
			ageTo,
			minRating,
			currentUser.LastPosition.Longitude,
			currentUser.LastPosition.Latitude,
			maxDistance,
			offset,
			limit,
			pq.Array(tags),
		)
	} else {
		rows, err = m.DB.Query(
			fmt.Sprintf(`
				SELECT %s FROM users
				WHERE %s
				ORDER BY %s, id OFFSET $11 LIMIT $12
			`, fields, searchQuery, sortQuery),
			currentUser.Id,
			startTime,
			currentUser.Gender,
			pq.Array(currentUser.GenderPreferences),
			ageFrom,
			ageTo,
			minRating,
			currentUser.LastPosition.Longitude,
			currentUser.LastPosition.Latitude,
			maxDistance,
			offset,
			limit,
		)
	}
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
		fmt.Sprintf(`
			SELECT %s FROM users
			JOIN photos ON users.id = photos.user_id
			WHERE username = $1 AND active = true AND
			gender IS NOT NULL AND array_length(gender_preferences, 1) > 0
		`, fields),
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

func (m UserModel) UpdateFameRating(userId int) (int, error) {
	var rating int
	err := m.DB.QueryRow(`
		WITH newRating AS (
			SELECT
			(SELECT COUNT(1) FROM visits WHERE user_id = $1) * 1 +
			(SELECT COUNT(1) FROM likes WHERE user_id = $1) * 3 +
			(
				SELECT COUNT(1) FROM likes t1
				JOIN likes t2
				ON t1.from_user_id = t2.user_id
				WHERE t1.user_id = $1 AND t2.from_user_id = $1
			) * 5
		)
		UPDATE users SET rating = (SELECT * FROM newRating) WHERE id = $1 RETURNING rating;
	`, userId).Scan(&rating)
	return rating, err
}

func (m UserModel) GetMaxRating() (int, error) {
	var maxRating sql.NullInt32
	err := m.DB.QueryRow("SELECT MAX(rating) FROM users").Scan(&maxRating)
	return int(maxRating.Int32), err
}

func (m UserModel) UpdateLastOnline(id int) error {
	_, err := m.DB.Exec("UPDATE users SET last_online = now() WHERE id = $1", id)
	return err
}

func (m UserModel) Count() (int, error) {
	var n int
	err := m.DB.QueryRow("SELECT COUNT(1) FROM users").Scan(&n)
	return n, err
}

//likes

func (m UserModel) CountLikesByUserId(userId int) (int, error) {
	var n int
	err := m.DB.QueryRow("SELECT COUNT(1) FROM likes WHERE user_id = $1", userId).Scan(&n)
	return n, err
}

func (m UserModel) CountLikesByFromUserId(fromUserId int) (int, error) {
	var n int
	err := m.DB.QueryRow("SELECT COUNT(1) FROM likes WHERE from_user_id = $1", fromUserId).Scan(&n)
	return n, err
}

func (m UserModel) GetLikesByUserId(
	userId int,
	offset int,
	limit int,
) ([]User, error) {
	rows, err := m.DB.Query(
		fmt.Sprintf(`
			SELECT %s FROM likes
			JOIN users ON likes.from_user_id = users.id
			WHERE user_id = $1
			ORDER BY create_time DESC OFFSET $2 LIMIT $3
		`, fields,
		),
		userId,
		offset,
		limit,
	)
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	var user User
	for rows.Next() {
		err := scanRow(rows, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetLikesByFromUserId(
	FromUserId int,
	offset int,
	limit int,
) ([]User, error) {
	rows, err := m.DB.Query(
		fmt.Sprintf(`
			SELECT %s FROM likes
			JOIN users ON likes.user_id = users.id
			WHERE from_user_id = $1
			ORDER BY create_time DESC OFFSET $2 LIMIT $3
		`, fields,
		),
		FromUserId,
		offset,
		limit,
	)
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	var user User
	for rows.Next() {
		err := scanRow(rows, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

// visits

func (m UserModel) CountVisitsByUserId(userId int) (int, error) {
	var n int
	err := m.DB.QueryRow("SELECT COUNT(1) FROM visits WHERE user_id = $1", userId).Scan(&n)
	return n, err
}

func (m UserModel) CountVisitsByFromUserId(fromUserId int) (int, error) {
	var n int
	err := m.DB.QueryRow("SELECT COUNT(1) FROM visits WHERE from_user_id = $1", fromUserId).Scan(&n)
	return n, err
}

func (m UserModel) GetVisitsByUserId(
	userId int,
	offset int,
	limit int,
) ([]User, error) {
	rows, err := m.DB.Query(
		fmt.Sprintf(`
			SELECT %s FROM visits
			JOIN users ON visits.from_user_id = users.id
			WHERE user_id = $1
			ORDER BY create_time DESC OFFSET $2 LIMIT $3
		`, fields,
		),
		userId,
		offset,
		limit,
	)
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	var user User
	for rows.Next() {
		err := scanRow(rows, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (m UserModel) GetVisitsByFromUserId(
	FromUserId int,
	offset int,
	limit int,
) ([]User, error) {
	rows, err := m.DB.Query(
		fmt.Sprintf(`
			SELECT %s FROM visits
			JOIN users ON visits.user_id = users.id
			WHERE from_user_id = $1
			ORDER BY create_time DESC OFFSET $2 LIMIT $3
		`, fields,
		),
		FromUserId,
		offset,
		limit,
	)
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	var user User
	for rows.Next() {
		err := scanRow(rows, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

//chat

func (m UserModel) GetAllMessageUsers(CurrentUser int) ([]User, error) {
	rows, err := m.DB.Query(
		fmt.Sprintf(`
			SELECT %s FROM users
			WHERE users.id IN 
				(SELECT t1.from_user_id FROM likes t1
				JOIN likes t2
				ON t1.from_user_id = t2.user_id AND t1.user_id = t2.from_user_id
				WHERE t1.user_id=$1)
		`, fields,
		),
		CurrentUser,
	)
	if err != nil {
		return nil, err
	}
	users := make([]User, 0)
	var user User
	for rows.Next() {
		err := scanRow(rows, &user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}
