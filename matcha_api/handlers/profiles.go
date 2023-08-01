package handlers

import (
	"database/sql"
	"matcha_api/errors"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"

	"goji.io/pat"
)

func VisitProfile(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	visitor := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	_, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}

	env.NotificationsHub.Broadcasts <- schemas.Notification{
		Type:     schemas.NotificationVisit,
		Username: visitor.Username,
	}
	return nil, nil
}
