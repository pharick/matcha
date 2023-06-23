package handlers

import (
	"context"
	"matcha_api/errors"
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
			return nil, errors.HttpError{Status: 401, Body: nil}
		}
		authHeader = strings.Split(authHeader[0], " ")
		if len(authHeader) != 2 || authHeader[0] != "Bearer" {
			return nil, errors.HttpError{Status: 401, Body: nil}
		}
		username, err := lib.ParseJWTSub(authHeader[1], env.Settings.JWTSecret)
		if err != nil {
			return nil, errors.HttpError{Status: 401, Body: nil}
		}
		user, err := env.Users.GetOneByUsername(username)
		if err != nil {
			return nil, errors.HttpError{Status: 401, Body: nil}
		}
		ctx := context.WithValue(r.Context(), ContextKey("User"), user)
		return inner(env, w, r.WithContext(ctx))
	}
	return mw
}
