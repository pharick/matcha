package models

import "database/sql"

type Photo struct {
	Id     int
	UserId int
	Url    string
}

type PhotoModel struct {
	DB *sql.DB
}

func (m PhotoModel) Create(
	user_id int,
	url string,
) (Photo, error) {
	var photo Photo
	err := m.DB.QueryRow(
		`INSERT INTO photos(user_id, url) 
		VALUES($1, $2) RETURNING id, user_id, url`,
		user_id, url,
	).Scan(
		&photo.Id,
		&photo.UserId,
		&photo.Url,
	)
	return photo, err
}
