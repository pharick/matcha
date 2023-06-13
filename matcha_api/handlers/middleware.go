package handlers

import (
	"matcha_api/lib"
	"net/http"
	"strings"
)

func (env *Env) AuthRequired(inner func(w http.ResponseWriter, r *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	mw := func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header["Authorization"]
		if len(authHeader) != 1 {
			handleError(w, nil, 401)
			return
		}
		authHeader = strings.Split(authHeader[0], " ")
		if len(authHeader) != 2 || authHeader[0] != "Bearer" {
			handleError(w, nil, 401)
			return
		}
		username, err := lib.JWTParseUsername(authHeader[1], env.Settings.JWTSecret)
		if err != nil {
			handleError(w, err, 401)
			return
		}

		_, err = env.Users.GetOneByUsername(username)
		if err != nil {
			handleError(w, err, 401)
			return
		}

		inner(w, r)
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
