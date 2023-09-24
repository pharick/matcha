package models

import (
	"database/sql"
)

type Block struct {
	UserId     int
	FromUserId int
}

type BlockModel struct {
	DB *sql.DB
}

func (m BlockModel) Create(fromUserId int, userId int) (Block, error) {
	var block Block
	err := m.DB.QueryRow(`
		INSERT INTO blocks (user_id, from_user_id) VALUES ($1, $2)
		RETURNING user_id, from_user_id
	`, userId, fromUserId).Scan(
		&block.UserId,
		&block.FromUserId,
	)
	return block, err
}

func (m BlockModel) Delete(fromUserId int, userId int) error {
	_, err := m.DB.Exec(
		"DELETE FROM blocks WHERE user_id = $1 AND from_user_id = $2",
		userId, fromUserId,
	)
	return err
}

func (m BlockModel) IsExists(fromUserId int, userId int) (bool, error) {
	var block Block
	err := m.DB.QueryRow(`
		SELECT user_id, from_user_id FROM blocks WHERE user_id = $1 AND from_user_id = $2
	`, userId, fromUserId).Scan(
		&block.UserId,
		&block.FromUserId,
	)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return true, err
}
