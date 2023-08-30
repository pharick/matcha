package handlers

import (
	"log"
	"matcha_api/lib/sockets"
	"matcha_api/models"
	"net/http"
)

func ChatWs(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	// tokenCookie, err := r.Cookie("token")
	// if err != nil {
	// 	lib.HttpJsonError(w, map[string]string{}, 401)
	// 	return
	// }
	// username, target, err := lib.ParseJWT(tokenCookie.Value, env.Settings.JWTSecret)
	// if err != nil || target != "auth" {
	// 	lib.HttpJsonError(w, map[string]string{}, 401)
	// 	return
	// }
	// user, err := env.Users.GetOneByUsername(username)
	// if err != nil {
	// 	lib.HttpJsonError(w, map[string]string{}, 401)
	// 	return
	// }
	user := r.Context().Value(ContextKey("User")).(models.User)
	conn, err := sockets.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return nil, nil
	}
	client := &sockets.Client{
		Hub:    env.ChatHub,
		Conn:   conn,
		Send:   make(chan any, 256),
		UserId: user.Id,
	}
	client.Hub.Register <- client
	go client.WritePump()
	go client.ReadPumpChat()
	return nil, nil
}
