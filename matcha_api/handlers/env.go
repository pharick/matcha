package handlers

import (
	"database/sql"
	"matcha_api/models"
	"matcha_api/settings"
)

type Env struct {
	Users    models.UserModel
	Settings settings.Settings
}

func CreateEnv(dbConn *sql.DB, settings settings.Settings) *Env {
	return &Env{
		Users:    models.UserModel{DB: dbConn},
		Settings: settings,
	}
}
