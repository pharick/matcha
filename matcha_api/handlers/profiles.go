package handlers

import (
	"database/sql"
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
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
	isBlocked, err := env.Blocks.IsExists(visitor.Id, user.Id)
	if err != nil {
		return nil, err
	}
	isMeBlocked, err := env.Blocks.IsExists(user.Id, visitor.Id)
	if err != nil {
		return nil, err
	}
	if isBlocked || isMeBlocked {
		return nil, errors.HttpError{Status: 403, Body: nil}
	}
	exists, _ := env.Visits.IsExists(user.Id, visitor.Id)
	if exists {
		return nil, errors.HttpError{Status: 409, Body: nil}
	}
	_, err = env.Visits.Create(user.Id, visitor.Id)
	if err != nil {
		return nil, err
	}
	go env.Users.UpdateFameRating(user.Id)
	err = lib.SendNotification(
		models.NotificationVisit,
		user.Id,
		visitor.Id,
		visitor.Username,
		env.Notifications,
		*env.NotificationsHub,
	)
	return nil, err
}

func SetLike(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	fromUser := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	if fromUser.Id == user.Id {
		return nil, nil
	}
	isBlocked, err := env.Blocks.IsExists(fromUser.Id, user.Id)
	if err != nil {
		return nil, err
	}
	isMeBlocked, err := env.Blocks.IsExists(user.Id, fromUser.Id)
	if err != nil {
		return nil, err
	}
	if isBlocked || isMeBlocked {
		return nil, errors.HttpError{Status: 403, Body: nil}
	}
	exists, _ := env.Likes.IsExists(user.Id, fromUser.Id)
	if exists {
		return nil, errors.HttpError{Status: 409, Body: nil}
	}
	_, err = env.Likes.Create(user.Id, fromUser.Id)
	if err != nil {
		return nil, err
	}
	go env.Users.UpdateFameRating(user.Id)
	go env.Users.UpdateFameRating(fromUser.Id)
	match, _ := env.Likes.IsExists(fromUser.Id, user.Id)
	var notificationType string
	if match {
		notificationType = models.NotificationMatch
	} else {
		notificationType = models.NotificationLike
	}
	err = lib.SendNotification(
		notificationType,
		user.Id,
		fromUser.Id,
		fromUser.Username,
		env.Notifications,
		*env.NotificationsHub,
	)
	if match {
		err = lib.SendNotification(
			notificationType,
			fromUser.Id,
			user.Id,
			user.Username,
			env.Notifications,
			*env.NotificationsHub,
		)
	}
	return nil, err
}

func UnsetLike(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	fromUser := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	exists, _ := env.Likes.IsExists(user.Id, fromUser.Id)
	if !exists {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	err = env.Likes.Delete(user.Id, fromUser.Id)
	if err != nil {
		return nil, err
	}
	go env.Users.UpdateFameRating(user.Id)
	go env.Users.UpdateFameRating(fromUser.Id)
	err = lib.SendNotification(
		models.NotificationUnlike,
		user.Id,
		fromUser.Id,
		fromUser.Username,
		env.Notifications,
		*env.NotificationsHub,
	)
	return nil, err
}

func BlockUser(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	fromUser := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	exists, _ := env.Blocks.IsExists(fromUser.Id, user.Id)
	if exists {
		return nil, errors.HttpError{Status: 409, Body: nil}
	}
	_, err = env.Blocks.Create(fromUser.Id, user.Id)
	if err != nil {
		return nil, err
	}
	err = env.Likes.Delete(user.Id, fromUser.Id)
	return nil, err
}

func UnblockUser(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	fromUser := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	exists, _ := env.Blocks.IsExists(fromUser.Id, user.Id)
	if !exists {
		return nil, errors.HttpError{Status: 400, Body: nil}
	}
	err = env.Blocks.Delete(fromUser.Id, user.Id)
	return nil, err
}
