package models

import (
	"database/sql"
)

type Report struct {
	UserId     int
	FromUserId int
}

type ReportModel struct {
	DB *sql.DB
}

func (m ReportModel) Create(fromUserId int, userId int) (Report, error) {
	var report Report
	err := m.DB.QueryRow(`
		INSERT INTO reports (user_id, from_user_id) VALUES ($1, $2)
		RETURNING user_id, from_user_id
	`, userId, fromUserId).Scan(
		&report.UserId,
		&report.FromUserId,
	)
	return report, err
}

func (m ReportModel) IsExists(fromUserId int, userId int) (bool, error) {
	var report Report
	err := m.DB.QueryRow(`
		SELECT user_id, from_user_id FROM reports WHERE user_id = $1 AND from_user_id = $2
	`, userId, fromUserId).Scan(
		&report.UserId,
		&report.FromUserId,
	)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return true, err
}
