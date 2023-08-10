package main

import (
	"log"
	"net/http"

	"matcha_api/db"
	"matcha_api/handlers"
	"matcha_api/lib"
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

	// Mock
	usersCount, _ := env.Users.Count()
	go lib.GenerateUsers(&env.Users, &env.Photos, 5-usersCount)

	mux := goji.NewMux()
	mux.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedHeaders:   []string{"Authorization"},
		AllowCredentials: true,
	}).Handler)

	// --- HTTP ---

	// auth
	mux.Handle(pat.Post("/register/"), handlers.Handler{Env: env, Handle: handlers.Register})
	mux.Handle(pat.Post("/activate/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.Activate)})
	mux.Handle(pat.Post("/login/"), handlers.Handler{Env: env, Handle: handlers.Login})
	mux.Handle(pat.Post("/password_change/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.PasswordChange)})
	mux.Handle(pat.Post("/password_reset/"), handlers.Handler{Env: env, Handle: handlers.PasswordReset})
	mux.Handle(pat.Post("/send_activation_email/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.SendActivationEmail)})
	mux.Handle(pat.Post("/email_change/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.EmailChange)})
	mux.Handle(pat.Post("/send_reset_email/"), handlers.Handler{Env: env, Handle: handlers.SendPasswordResetEmail})
	mux.Handle(pat.Get("/whoami/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.WhoAmI)})

	// users
	mux.Handle(pat.Post("/search/"), handlers.Handler{Env: env, Handle: handlers.UserSearch})
	mux.Handle(pat.Get("/users/:username/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UserProfile)})
	mux.Handle(pat.Patch("/users/:username/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UpdateUser)})
	mux.Handle(pat.Post("/update_position/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UpdatePosition)})

	// photos
	mux.Handle(pat.Post("/users/:username/photos/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UploadPhoto)})
	mux.Handle(pat.Get("/users/:username/photos/"), handlers.Handler{Env: env, Handle: handlers.PhotoList})
	mux.Handle(pat.Get("/users/:username/photos/:id/"), handlers.Handler{Env: env, Handle: handlers.GetPhoto})
	mux.Handle(pat.Patch("/users/:username/photos/:id/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UpdatePhoto)})
	mux.Handle(pat.Delete("/users/:username/photos/:id/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.RemovePhoto)})

	// tags
	mux.Handle(pat.Post("/tags/find/"), handlers.Handler{Env: env, Handle: handlers.FindTag})

	// profile
	mux.Handle(pat.Post("/users/:username/visit/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.VisitProfile)})
	mux.Handle(pat.Post("/users/:username/like/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.SetLike)})
	mux.Handle(pat.Post("/users/:username/unlike/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.UnsetLike)})

	// notifications
	mux.Handle(pat.Get("/notifications/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.GetAllNotifications)})
	mux.Handle(pat.Post("/notifications/:id/view/"), handlers.Handler{Env: env, Handle: handlers.AuthRequired(handlers.ViewNotification)})

	// --- WEBSOCKETS ---

	// notifications
	mux.HandleFunc(
		pat.Get("/ws/notifications/"),
		func(w http.ResponseWriter, r *http.Request) {
			handlers.ServeNotificationsWs(env, w, r)
		},
	)

	http.ListenAndServe(":8000", mux)
}
