package handlers

import (
	"context"
	"log"
	"matcha_api/lib"
	"net/http"
	"strings"
)

type ContextKey string

func AuthRequired(
	inner func(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error),
) func(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
	mw := func(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error) {
		authHeader := r.Header["Authorization"]
		if len(authHeader) != 1 {
			return nil, HttpError{401}
		}
		authHeader = strings.Split(authHeader[0], " ")
		if len(authHeader) != 2 || authHeader[0] != "Bearer" {
			return nil, HttpError{401}
		}
		username, err := lib.JWTParseUsername(authHeader[1], env.Settings.JWTSecret)
		if err != nil {
			log.Println(err)
			return nil, HttpError{401}
		}
		user, err := env.Users.GetOneByUsername(username)
		if err != nil {
			return nil, HttpError{401}
		}
		ctx := context.WithValue(r.Context(), ContextKey("User"), user)
		return inner(env, w, r.WithContext(ctx))
	}
	return mw
}

func AllowCors(inner http.Handler) http.Handler {
	mw := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		inner.ServeHTTP(w, r)
	}
	return http.HandlerFunc(mw)
}
