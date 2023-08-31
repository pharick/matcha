package models

import (
	"database/sql"
)

type ChatMessage struct {
	Id         int
	FromUserId int
	ToUserId   int
	Text       string
	CreatedAt  string
}

type ChatMessageModel struct {
	DB *sql.DB
}

func (m ChatMessageModel) Create(fromUserId int, toUserId int, text string) (ChatMessage, error) {
	var msg ChatMessage
	err := m.DB.QueryRow(`
		INSERT INTO chat_messages(from_user_id, to_user_id, text) VALUES ($1, $2, $3)
		RETURNING from_user_id, to_user_id, text, created_at
	`, fromUserId, toUserId, text).Scan(
		&msg.FromUserId,
		&msg.ToUserId,
		&msg.Text,
		&msg.CreatedAt,
	)
	return msg, err
}

func (m ChatMessageModel) GetAllMessages(userId1 int, userId2 int) ([]ChatMessage, error) {
	messages := make([]ChatMessage, 0)
	rows, err := m.DB.Query(`
		SELECT id, from_user_id, to_user_id, text, created_at
		FROM chat_messages
		WHERE (from_user_id = $1 AND to_user_id = $2) OR (from_user_id = $2 AND to_user_id = $1)
		ORDER BY created_at
	`, userId1, userId2)
	if err != nil {
		return nil, err
	}
	var msg ChatMessage
	for rows.Next() {
		err := rows.Scan(
			&msg.Id,
			&msg.FromUserId,
			&msg.ToUserId,
			&msg.Text,
			&msg.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}
