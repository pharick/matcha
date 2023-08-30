package handlers

import (
	"fmt"
	"log"
	"matcha_api/errors"
	"matcha_api/lib/sockets"
	"matcha_api/models"
	"net/http"
	"strconv"

	"goji.io/pat"
)

func NotificationsWs(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	user := r.Context().Value(ContextKey("User")).(models.User)
	conn, err := sockets.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return nil, nil
	}
	client := &sockets.Client{
		Hub:      env.NotificationsHub,
		Conn:     conn,
		Send:     make(chan any, 256),
		Received: make(chan []byte, 256),
		Id:       fmt.Sprintf("%v", user.Id),
	}
	client.Hub.Register <- client
	env.Users.UpdateLastOnline(user.Id)
	go client.WritePump()
	go client.ReadPump()
	return nil, nil
}

func ViewNotification(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	user := r.Context().Value(ContextKey("User")).(models.User)
	id, err := strconv.Atoi(pat.Param(r, "id"))
	if err != nil {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	_, err = env.Notifications.MarkViewed(id, user.Id)
	return nil, err
}

func GetAllNotifications(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	user := r.Context().Value(ContextKey("User")).(models.User)
	notifications, err := env.Notifications.GetAllByUserId(user.Id)
	return notifications, err
}

func GetUnreadNotifications(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	user := r.Context().Value(ContextKey("User")).(models.User)
	notifications, err := env.Notifications.GetUnreadByUserId(user.Id)
	return notifications, err
}
