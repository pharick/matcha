package models

import (
	"database/sql"
)

type Photo struct {
	Id     int
	UserId int
	Index  int
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
	var maxIndex int
	err := m.DB.QueryRow(
		`SELECT COALESCE(MAX(index), 0) FROM photos WHERE user_id = $1`,
		user_id,
	).Scan(&maxIndex)
	if err != nil {
		return photo, err
	}
	err = m.DB.QueryRow(
		`INSERT INTO photos(user_id, index, url)
		VALUES($1, $2, $3) RETURNING id, user_id, index, url`,
		user_id, maxIndex+1, url,
	).Scan(
		&photo.Id,
		&photo.UserId,
		&photo.Index,
		&photo.Url,
	)
	return photo, err
}

func (m PhotoModel) GetOneById(id int) (Photo, error) {
	var photo Photo
	err := m.DB.QueryRow("SELECT id, user_id, index, url FROM photos WHERE id = $1", id).Scan(
		&photo.Id,
		&photo.UserId,
		&photo.Index,
		&photo.Url,
	)
	return photo, err
}

func (m PhotoModel) Update(d Photo) (Photo, error) {
	var photo Photo
	res, err := m.DB.Query(
		"UPDATE photos SET index = index + 1 WHERE index >= $1",
		d.Index,
	)
	if err != nil {
		return photo, err
	}
	defer res.Close()
	err = m.DB.QueryRow(
		`UPDATE photos SET index = $2 
		WHERE id = $1
		RETURNING id, user_id, index, url`,
		d.Id, d.Index,
	).Scan(
		&photo.Id,
		&photo.UserId,
		&photo.Index,
		&photo.Url,
	)
	return photo, err
}

func (m PhotoModel) Remove(id int) error {
	res, err := m.DB.Query(
		"DELETE FROM photos WHERE id =  $1",
		id,
	)
	if err != nil {
		return err
	}
	defer res.Close()
	return nil
}

func (m PhotoModel) GetAllByUserId(userId int) ([]Photo, error) {
	photos := make([]Photo, 0)
	rows, err := m.DB.Query(
		`SELECT id, user_id, index, url
		FROM photos WHERE user_id = $1
		ORDER BY index`,
		userId,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var photo Photo
		err := rows.Scan(
			&photo.Id,
			&photo.UserId,
			&photo.Index,
			&photo.Url,
		)
		if err != nil {
			return nil, err
		}
		photos = append(photos, photo)
	}
	return photos, nil
}

func (m PhotoModel) GetFirstByUserId(userId int) (Photo, error) {
	var photo Photo
	row := m.DB.QueryRow(
		"SELECT id, user_id, index, url FROM photos WHERE user_id = $1 ORDER BY index LIMIT 1",
		userId,
	)
	err := row.Scan(
		&photo.Id,
		&photo.UserId,
		&photo.Index,
		&photo.Url,
	)
	return photo, err
}
