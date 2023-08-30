package lib

import (
	"fmt"
	"matcha_api/lib/sockets"
	"matcha_api/models"
	"matcha_api/schemas"
)

func SendNotification(
	notificationType string,
	userId int,
	fromUserId int,
	fromUsername string,
	notifications models.NotificationModel,
	hub sockets.Hub,
) error {
	notification, err := notifications.Create(notificationType, userId, fromUserId)
	if err != nil {
		return err
	}
	ret := schemas.NotificationReturn{
		Id:         notification.Id,
		Type:       notification.Type,
		Username:   fromUsername,
		CreateTime: notification.CreateTime,
		Viewed:     notification.Viewed,
	}
	hub.Private <- sockets.PrivateMessage{
		ClientId: fmt.Sprintf("%v", userId),
		Message:  ret,
	}
	return nil
}
