package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"matcha_api/errors"
	"matcha_api/lib/sockets"
	"matcha_api/lib"
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
	isMatch, err := env.Likes.IsMatch(currentUser.Id, user.Id)
	if err != nil {
		return nil, err
	}
	isBlocked, err := env.Blocks.IsExists(user.Id, currentUser.Id)
	if err != nil {
		return nil, err
	}
	if !isMatch || isBlocked {
		return nil, errors.HttpError{Status: 403, Body: nil}
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
		Id:       fmt.Sprintf("%v.%v", currentUser.Id, user.Id),
	}
	client.Hub.Register <- client
	go client.WritePump()
	go client.ReadPump()

	log.Printf("%s start waiting messages", currentUser.Username)
	var newMsg schemas.NewChatMessage
	for data := range client.Received {
		log.Printf("New message for %s from %s", currentUser.Username, user.Username)
		err := json.Unmarshal(data, &newMsg)
		if err != nil {
			log.Println(err)
			continue
		}
		msg, err := env.ChatMessages.Create(currentUser.Id, user.Id, newMsg.Text)
		if err != nil {
			log.Println(err)
			continue
		}
		ret := schemas.ChatMessageReturn{
			Id:         msg.Id,
			FromUserId: msg.FromUserId,
			ToUserId:   msg.ToUserId,
			Text:       msg.Text,
			CreatedAt:  msg.CreatedAt,
		}
		client.Hub.Private <- sockets.PrivateMessage{
			ClientId: fmt.Sprintf("%v.%v", user.Id, currentUser.Id),
			Message:  ret,
		}
		client.Hub.Private <- sockets.PrivateMessage{
			ClientId: fmt.Sprintf("%v.%v", currentUser.Id, user.Id),
			Message:  ret,
		}
		err = lib.SendNotification(
			models.NotificationMessage,
			user.Id,
			currentUser.Id,
			currentUser.Username,
			env.Notifications,
			*env.NotificationsHub,
		)
		if err != nil {
			log.Println(err)
			return nil, err
		}
	}
	log.Printf("%s stop waiting messages", currentUser.Username)
	return nil, nil
}

func GetAllChatMessages(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	currentUser := r.Context().Value(ContextKey("User")).(models.User)
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneActiveByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	messages, err := env.ChatMessages.GetAllMessages(currentUser.Id, user.Id)
	if err != nil {
		return nil, err
	}
	messagesRet := make([]schemas.ChatMessageReturn, 0, len(messages))
	for _, msg := range messages {
		messagesRet = append(messagesRet, schemas.ChatMessageReturn{
			Id:         msg.Id,
			FromUserId: msg.FromUserId,
			ToUserId:   msg.ToUserId,
			Text:       msg.Text,
			CreatedAt:  msg.CreatedAt,
		})
	}
	ret := schemas.ChatMessagesReturn{
		List: messagesRet,
	}
	return ret, nil
}
