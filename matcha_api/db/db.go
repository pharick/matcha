package db

import (
	"database/sql"
	"fmt"
	"matcha_api/settings"
)

func Connect(settings settings.Settings) (db *sql.DB, err error) {
	connStr := fmt.Sprintf(
		"host=db port=5432 user=%s password=%s dbname=%s sslmode=disable",
		settings.PostgresUser,
		settings.PostgresPassword,
		settings.PostgresDb,
	)
	db, err = sql.Open("postgres", connStr)
	return
}
