package models

import (
	"database/sql"
	"log"
)

type Like struct {
	UserId     int
	FromUserId int
}

type LikeModel struct {
	DB *sql.DB
}

func (m LikeModel) Create(userId int, fromUserId int) (Like, error) {
	var like Like
	err := m.DB.QueryRow(`
		INSERT INTO likes(user_id, from_user_id) VALUES ($1, $2)
		RETURNING user_id, from_user_id
	`, userId, fromUserId).Scan(
		&like.UserId,
		&like.FromUserId,
	)
	return like, err
}

func (m LikeModel) IsExists(userId int, fromUserId int) (bool, error) {
	var like Like
	log.Printf("%v %v", userId, fromUserId)
	err := m.DB.QueryRow(`
		SELECT user_id, from_user_id FROM likes WHERE user_id = $1 AND from_user_id = $2
	`, userId, fromUserId).Scan(
		&like.UserId,
		&like.FromUserId,
	)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return true, err
}
