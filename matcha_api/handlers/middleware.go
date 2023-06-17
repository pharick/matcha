package handlers

import (
	"matcha_api/lib"
	"net/http"
	"strings"
)

func AuthRequired(
	inner Handler,
) Handler {
	mw := func(env *Env, w http.ResponseWriter, r *http.Request) error {
		authHeader := r.Header["Authorization"]
		if len(authHeader) != 1 {
			return HttpError{401}
		}
		authHeader = strings.Split(authHeader[0], " ")
		if len(authHeader) != 2 || authHeader[0] != "Bearer" {
			return HttpError{401}
		}
		username, err := lib.JWTParseUsername(authHeader[1], env.Settings.JWTSecret)
		if err != nil {
			return HttpError{401}
		}
		_, err = env.Users.GetOneByUsername(username)
		if err != nil {
			return HttpError{401}
		}
		inner.ServeHTTP(w, r)
		return nil
	}
	return Handler{inner.Env, mw}
}

func AllowCors(inner http.Handler) http.Handler {
	mw := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		inner.ServeHTTP(w, r)
	}
	return http.HandlerFunc(mw)
}
