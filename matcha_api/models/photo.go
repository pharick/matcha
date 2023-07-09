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

func (m PhotoModel) GetAllByUserId(userId int) ([]Photo, error) {
	photos := make([]Photo, 0)
	rows, err := m.DB.Query("SELECT id, user_id, url FROM photos WHERE user_id = $1", userId)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var photo Photo
		err := rows.Scan(
			&photo.Id,
			&photo.UserId,
			&photo.Url,
		)
		if err != nil {
			return nil, err
		}
		photos = append(photos, photo)
	}
	return photos, nil
}
