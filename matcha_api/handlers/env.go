package handlers

import (
	"database/sql"
	"matcha_api/models"
)

type Env struct {
	Users models.UserModel
}

func CreateEnv(dbConn *sql.DB) *Env {
	return &Env{
		Users: models.UserModel{DB: dbConn},
	}
}
