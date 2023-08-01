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
	Settings         settings.Settings
	NotificationsHub *sockets.Hub
}

func CreateEnv(dbConn *sql.DB, settings settings.Settings) *Env {
	notificationsHub := sockets.NewHub()
	go notificationsHub.Run()

	return &Env{
		Users:            models.UserModel{DB: dbConn},
		Photos:           models.PhotoModel{DB: dbConn},
		Tags:             models.TagModel{DB: dbConn},
		Settings:         settings,
		NotificationsHub: notificationsHub,
	}
}
