package models

import (
	"database/sql"
	"matcha_api/schemas"
)

const (
	NotificationVisit  string = "visit"
	NotificationLike   string = "like"
	NotificationUnlike string = "unlike"
)

type Notification struct {
	Id         int
	Type       string
	UserId     int
	FromUserId int
	CreateTime string
	Viewed     bool
}

type NotificationModel struct {
	DB *sql.DB
}

func (m NotificationModel) Create(notificationType string, userId int, fromUserId int) (Notification, error) {
	var notification Notification
	err := m.DB.QueryRow(
		`INSERT INTO notifications(type, user_id, from_user_id)
		VALUES($1, $2, $3) RETURNING id, type, user_id, from_user_id, create_time, viewed`,
		notificationType, userId, fromUserId,
	).Scan(
		&notification.Id,
		&notification.Type,
		&notification.UserId,
		&notification.FromUserId,
		&notification.CreateTime,
		&notification.Viewed,
	)
	return notification, err
}

func (m NotificationModel) MarkViewed(notificationId int, userId int) (Notification, error) {
	var notification Notification
	err := m.DB.QueryRow(
		`UPDATE notifications SET viewed = true WHERE id = $1 AND user_id = $2
		RETURNING id, type, user_id, from_user_id, create_time, viewed`,
		notificationId, userId,
	).Scan(
		&notification.Id,
		&notification.Type,
		&notification.UserId,
		&notification.FromUserId,
		&notification.CreateTime,
		&notification.Viewed,
	)
	return notification, err
}

func (m NotificationModel) GetUnreadByUserId(userId int) ([]schemas.NotificationReturn, error) {
	notifications := make([]schemas.NotificationReturn, 0)
	rows, err := m.DB.Query(
		`SELECT notifications.id, type, users.username, create_time, viewed
		FROM notifications JOIN users ON from_user_id = users.id
		WHERE user_id = $1 AND viewed = false ORDER BY create_time DESC`,
		userId,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var notification schemas.NotificationReturn
		err := rows.Scan(
			&notification.Id,
			&notification.Type,
			&notification.Username,
			&notification.CreateTime,
			&notification.Viewed,
		)
		if err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}
	return notifications, nil
}
