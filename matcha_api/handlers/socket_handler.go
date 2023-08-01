package handlers

import (
	"log"
	"matcha_api/lib"
	"matcha_api/lib/sockets"
	"net/http"
)

func ServeWs(env *Env, w http.ResponseWriter, r *http.Request) {
	tokenCookie, err := r.Cookie("token")
	if err != nil {
		lib.HttpJsonError(w, map[string]string{}, 401)
		return
	}
	username, target, err := lib.ParseJWT(tokenCookie.Value, env.Settings.JWTSecret)
	if err != nil || target != "auth" {
		lib.HttpJsonError(w, map[string]string{}, 401)
		return
	}
	user, err := env.Users.GetOneByUsername(username)
	if err != nil {
		lib.HttpJsonError(w, map[string]string{}, 401)
		return
	}

	conn, err := sockets.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &sockets.Client{
		Hub:    env.NotificationsHub,
		Conn:   conn,
		Send:   make(chan []byte, 256),
		UserId: user.Id,
	}
	client.Hub.Register <- client

	go client.ReadPump()
	go client.WritePump()
}
