package main

import (
	"log"
	"net/http"

	"matcha_api/db"
	"matcha_api/handlers"
	"matcha_api/settings"

	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"goji.io"
	"goji.io/pat"
)

func main() {
	settings, err := settings.LoadSettings()
	if err != nil {
		log.Fatalln(err)
	}
	dbConn, err := db.Connect(settings)
	if err != nil {
		log.Fatalln(err)
	}
	env := handlers.CreateEnv(dbConn, settings)

	mux := goji.NewMux()

	// cors
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Authorization"},
		Debug:            true,
	})
	mux.Use(c.Handler)

	// auth
	mux.Handle(pat.Post("/register"), handlers.Handler{Env: env, Handle: handlers.Register})
	mux.Handle(pat.Post("/login"), handlers.Handler{Env: env, Handle: handlers.Login})
	mux.Handle(pat.Get("/whoami"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.WhoAmI)})

	// users
	mux.Handle(pat.Get("/users/"), handlers.Handler{Env: env, Handle: handlers.UserList})
	mux.Handle(pat.Get("/users/:username"), handlers.Handler{Env: env, Handle: handlers.UserProfile})

	http.ListenAndServe(":8000", mux)
}
