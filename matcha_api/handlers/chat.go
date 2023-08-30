package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"matcha_api/errors"
	"matcha_api/lib/sockets"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"

	"goji.io/pat"
)

func ChatWs(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)

	username := pat.Param(r, "username")
	user, err := env.Users.GetOneActiveByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}

	conn, err := sockets.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}

	client := &sockets.Client{
		Hub:      env.ChatHub,
		Conn:     conn,
		Send:     make(chan any, 256),
		Received: make(chan []byte, 256),
		UserId:   currentUser.Id,
	}
	client.Hub.Register <- client

	go client.WritePump()
	go client.ReadPump()

	log.Printf("%s start waiting messages", currentUser.Username)
	var msg schemas.ChatMessage
	for data := range client.Received {
		log.Printf("New message for %s from %s", currentUser.Username, user.Username)
		err := json.Unmarshal(data, &msg)
		if err != nil {
			continue
		}
		client.Hub.Private <- sockets.PrivateMessage{
			UserId: user.Id,
			Message: schemas.ChatMessage{
				Text: msg.Text,
			},
		}
	}
	log.Printf("%s stop waiting messages", currentUser.Username)

	return nil, nil
}
