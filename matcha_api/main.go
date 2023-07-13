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
	if err != nil {
		log.Fatalln(err)
	}
	env := handlers.CreateEnv(dbConn, settings)

	mux := goji.NewMux()

	// auth
	mux.Handle(pat.Post("/register/"), handlers.Handler{Env: env, Handle: handlers.Register})
	mux.Handle(pat.Post("/activate/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.Activate)})
	mux.Handle(pat.Post("/login/"), handlers.Handler{Env: env, Handle: handlers.Login})
	mux.Handle(pat.Post("/password_change/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.PasswordChange)})
	mux.Handle(pat.Post("/password_reset/"), handlers.Handler{Env: env, Handle: handlers.PasswordReset})
	mux.Handle(pat.Post("/send_activation_email/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.SendActivationEmail)})
	mux.Handle(pat.Post("/send_reset_email/"), handlers.Handler{Env: env, Handle: handlers.SendPasswordResetEmail})
	mux.Handle(pat.Get("/whoami/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.WhoAmI)})

	// users
	mux.Handle(pat.Get("/users/"), handlers.Handler{Env: env, Handle: handlers.UserList})
	mux.Handle(pat.Get("/users/:username/"), handlers.Handler{Env: env, Handle: handlers.UserProfile})
	mux.Handle(pat.Patch("/users/:username/"), handlers.Handler{Env: env, Handle: handlers.UpdateUser})

	// photos
	mux.Handle(pat.Post("/users/:username/photos/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UploadPhoto)})
	mux.Handle(pat.Get("/users/:username/photos/"), handlers.Handler{Env: env, Handle: handlers.PhotoList})
	mux.Handle(pat.Get("/users/:username/photos/:id/"), handlers.Handler{Env: env, Handle: handlers.GetPhoto})
	mux.Handle(pat.Patch("/users/:username/photos/:id/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UpdatePhoto)})
	mux.Handle(pat.Delete("/users/:username/photos/:id/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.RemovePhoto)})

	http.ListenAndServe(":8000", mux)
}
