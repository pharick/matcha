package main

import (
	"log"
	"net/http"

	"matcha_api/db"
	"matcha_api/handlers"
	"matcha_api/settings"

	_ "github.com/lib/pq"
	"goji.io"
	"goji.io/pat"
)

func main() {
	settings, err := settings.LoadSettings()
	if err != nil {
		log.Fatalln(err)
	}
	dbConn, err := db.Connect(settings)
	env := handlers.CreateEnv(dbConn, settings)
	if err != nil {
		log.Fatalln(err)
	}

	mux := goji.NewMux()

	// auth
	mux.HandleFunc(pat.Post("/register"), env.Register)
	mux.HandleFunc(pat.Post("/login"), env.Login)

	// users
	mux.HandleFunc(pat.Get("/users/:username"), env.UserProfile)

	http.ListenAndServe(":8000", mux)
}
