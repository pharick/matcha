package models

import "database/sql"

type Visit struct {
	UserId     int
	FromUserId int
}

type VisitModel struct {
	DB *sql.DB
}

func (m VisitModel) Create(userId int, fromUserId int) (Visit, error) {
	var visit Visit
	err := m.DB.QueryRow(`
		INSERT INTO visits(user_id, from_user_id) VALUES ($1, $2)
		RETURNING user_id, from_user_id
	`, userId, fromUserId).Scan(
		&visit.UserId,
		&visit.FromUserId,
	)
	return visit, err
}

func (m VisitModel) IsExists(userId int, fromUserId int) (bool, error) {
	err := m.DB.QueryRow(`
		SELECT * FROM visits WHERE user_id = $1 AND from_user_id = $2
	`, userId, fromUserId).Scan()
	if err == sql.ErrNoRows {
		return false, nil
	}
	return true, err
}
