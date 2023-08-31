package handlers

import (
	"database/sql"
	"matcha_api/lib/sockets"
	"matcha_api/models"
	"matcha_api/settings"
)

type Env struct {
	Users            models.UserModel
	Photos           models.PhotoModel
	Tags             models.TagModel
	Notifications    models.NotificationModel
	Visits           models.VisitModel
	Likes            models.LikeModel
	ChatMessages     models.ChatMessageModel
	Settings         settings.Settings
	NotificationsHub *sockets.Hub
	ChatHub          *sockets.Hub
}

func CreateEnv(dbConn *sql.DB, settings settings.Settings) *Env {
	notificationsHub := sockets.NewHub()
	go notificationsHub.Run()

	chatHub := sockets.NewHub()
	go chatHub.Run()

	return &Env{
		Users:            models.UserModel{DB: dbConn},
		Photos:           models.PhotoModel{DB: dbConn},
		Tags:             models.TagModel{DB: dbConn},
		Notifications:    models.NotificationModel{DB: dbConn},
		Visits:           models.VisitModel{DB: dbConn},
		Likes:            models.LikeModel{DB: dbConn},
		ChatMessages:     models.ChatMessageModel{DB: dbConn},
		Settings:         settings,
		NotificationsHub: notificationsHub,
		ChatHub:          chatHub,
	}
}
