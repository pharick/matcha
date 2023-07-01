package models

import "database/sql"

type Tag struct {
	Id   int
	Name string
}

type TagModel struct {
	DB *sql.DB
}

func (m TagModel) CreateIfNotExists(name string) (Tag, error) {
	var tag Tag
	err := m.DB.QueryRow(
		`INSERT INTO tags(name) 
		VALUES($1) RETURNING id, name 
		ON CONFLICT DO NOTHING`,
		name,
	).Scan(
		&tag.Id,
		&tag.Name,
	)
	return tag, err
}
