package models

import "database/sql"

type Like struct {
	UserId     int
	FromUserId int
}

type LikeModel struct {
	DB *sql.DB
}

func (m LikeModel) Create(userId int, fromUserId int) (Like, error) {
	var like Like
	err := m.DB.QueryRow(`
		INSERT INTO likes(user_id, from_user_id) VALUES ($1, $2)
		RETURNING user_id, from_user_id
	`, userId, fromUserId).Scan(
		&like.UserId,
		&like.FromUserId,
	)
	return like, err
}

func (m LikeModel) Delete(userId int, fromUserId int) error {
	res, err := m.DB.Query(
		"DELETE FROM likes WHERE user_id = $1 AND from_user_id = $2",
		userId, fromUserId,
	)
	if err != nil {
		return err
	}
	defer res.Close()
	return nil
}

func (m LikeModel) IsExists(userId int, fromUserId int) (bool, error) {
	var like Like
	err := m.DB.QueryRow(`
		SELECT user_id, from_user_id FROM likes WHERE user_id = $1 AND from_user_id = $2
	`, userId, fromUserId).Scan(
		&like.UserId,
		&like.FromUserId,
	)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return true, err
}

func (m LikeModel) IsMatch(userId1 int, userId2 int) (bool, error) {
	var count int
	err := m.DB.QueryRow(`
		SELECT COUNT(1) FROM likes t1
		JOIN likes t2
		ON t1.from_user_id = t2.user_id
		WHERE t1.user_id = $1 AND t1.from_user_id = $2 AND t2.from_user_id = $1
	`, userId1, userId2).Scan(&count)
	return count > 0, err
}
