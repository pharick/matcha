package models

import (
	"database/sql"
)

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
		VALUES($1) ON CONFLICT (name) DO UPDATE 
		SET name = excluded.name 
		RETURNING id, name`,
		name,
	).Scan(
		&tag.Id,
		&tag.Name,
	)
	return tag, err
}

func (m TagModel) Set(userId int, tagNames []string) ([]string, error) {
	_, err := m.DB.Exec("DELETE FROM users_tags WHERE user_id = $1", userId)
	if err != nil {
		return nil, err
	}
	insertedTagNames := make([]string, 0)
	for _, name := range tagNames {
		tag, err := m.CreateIfNotExists(name)
		if err != nil && err != sql.ErrNoRows {
			return nil, err
		}
		_, err = m.DB.Exec(
			"INSERT INTO users_tags(user_id, tag_id) VALUES($1, $2)",
			userId, tag.Id,
		)
		if err != nil {
			return nil, err
		}
		insertedTagNames = append(insertedTagNames, tag.Name)
	}
	return insertedTagNames, nil
}

func (m TagModel) GetSuggestions(value string) ([]string, error) {
	tagNames := make([]string, 0)
	rows, err := m.DB.Query(
		"SELECT name FROM tags WHERE name LIKE '%' || $1 || '%' LIMIT 5",
		value,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var tag string
		err := rows.Scan(&tag)
		if err != nil {
			return nil, err
		}
		tagNames = append(tagNames, tag)
	}
	return tagNames, nil
}

func (m TagModel) GetAllByUserId(userId int) ([]string, error) {
	tagNames := make([]string, 0)
	rows, err := m.DB.Query(
		"SELECT name FROM users_tags JOIN tags ON users_tags.tag_id = tags.id WHERE user_id = $1",
		userId,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var tag string
		err := rows.Scan(&tag)
		if err != nil {
			return nil, err
		}
		tagNames = append(tagNames, tag)
	}
	return tagNames, nil
}
