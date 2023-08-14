package handlers

import (
	"database/sql"
	"matcha_api/errors"
	"matcha_api/lib/sockets"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"

	"goji.io/pat"
)

func VisitProfile(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	visitor := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	if visitor.Id == user.Id {
		return nil, nil
	}
	exists, _ := env.Visits.IsExists(user.Id, visitor.Id)
	if exists {
		return nil, errors.HttpError{Status: 409, Body: nil}
	}
	_, err = env.Visits.Create(user.Id, visitor.Id)
	if err != nil {
		return nil, errors.HttpError{Status: 500, Body: nil}
	}
	go env.Users.UpdateFameRating(user.Id)
	notification, err := env.Notifications.Create(models.NotificationVisit, user.Id, visitor.Id)
	if err != nil {
		return nil, errors.HttpError{Status: 500, Body: nil}
	}
	ret := schemas.NotificationReturn{
		Id:         notification.Id,
		Type:       notification.Type,
		Username:   visitor.Username,
		CreateTime: notification.CreateTime,
		Viewed:     notification.Viewed,
	}
	env.NotificationsHub.Private <- sockets.PrivateMessage{
		UserId:  user.Id,
		Message: ret,
	}
	return nil, nil
}

func SetLike(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	from_user := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	if from_user.Id == user.Id {
		return nil, nil
	}
	exists, _ := env.Likes.IsExists(user.Id, from_user.Id)
	if exists {
		return nil, errors.HttpError{Status: 409, Body: nil}
	}
	_, err = env.Likes.Create(user.Id, from_user.Id)
	if err != nil {
		return nil, errors.HttpError{Status: 500, Body: nil}
	}
	go env.Users.UpdateFameRating(user.Id)
	go env.Users.UpdateFameRating(from_user.Id)
	notification, err := env.Notifications.Create(models.NotificationLike, user.Id, from_user.Id)
	if err != nil {
		return nil, errors.HttpError{Status: 500, Body: nil}
	}
	ret := schemas.NotificationReturn{
		Id:         notification.Id,
		Type:       notification.Type,
		Username:   from_user.Username,
		CreateTime: notification.CreateTime,
		Viewed:     notification.Viewed,
	}
	env.NotificationsHub.Private <- sockets.PrivateMessage{
		UserId:  user.Id,
		Message: ret,
	}
	return nil, nil
}

func UnsetLike(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	from_user := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	exists, _ := env.Likes.IsExists(user.Id, from_user.Id)
	if !exists {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	err = env.Likes.Delete(user.Id, from_user.Id)
	if err != nil {
		return nil, errors.HttpError{Status: 500, Body: nil}
	}
	go env.Users.UpdateFameRating(user.Id)
	go env.Users.UpdateFameRating(from_user.Id)
	notification, err := env.Notifications.Create(models.NotificationUnlike, user.Id, from_user.Id)
	if err != nil {
		return nil, errors.HttpError{Status: 500, Body: nil}
	}
	ret := schemas.NotificationReturn{
		Id:         notification.Id,
		Type:       notification.Type,
		Username:   from_user.Username,
		CreateTime: notification.CreateTime,
		Viewed:     notification.Viewed,
	}
	env.NotificationsHub.Private <- sockets.PrivateMessage{
		UserId:  user.Id,
		Message: ret,
	}
	return nil, nil
}
