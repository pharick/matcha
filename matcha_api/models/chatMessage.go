package models

import "database/sql"

type ChatMessage struct {
	Id         int
	FromUserId int
	ToUserId   int
	Text       string
}

type ChatMessageModel struct {
	DB *sql.DB
}

func (m ChatMessageModel) Create(fromUserId int, toUserId int, text string) (ChatMessage, error) {
	var msg ChatMessage
	err := m.DB.QueryRow(`
		INSERT INTO chat_messages(from_user_id, to_user_id, text) VALUES ($1, $2, $3)
		RETURNING from_user_id, to_user_id, text
	`, fromUserId, toUserId, text).Scan(
		&msg.FromUserId,
		&msg.ToUserId,
		&msg.Text,
	)
	return msg, err
}
