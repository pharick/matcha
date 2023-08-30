package handlers

import (
	"context"
	"fmt"
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
	"net/http"
	"strings"
)

type ContextKey string

func AuthRequired(
	inner func(env *Env, w http.ResponseWriter, r *http.Request) (any, error),
) func(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	mw := func(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
		authHeader := r.Header["Authorization"]
		if len(authHeader) != 1 {
			return nil, errors.HttpError{Status: 401, Body: nil}
		}
		authHeader = strings.Split(authHeader[0], " ")
		if len(authHeader) != 2 || authHeader[0] != "Bearer" {
			return nil, errors.HttpError{Status: 401, Body: nil}
		}
		username, target, err := lib.ParseJWT(authHeader[1], env.Settings.JWTSecret)
		if err != nil || target != "auth" {
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

func FullProfileRequired(
	inner func(env *Env, w http.ResponseWriter, r *http.Request) (any, error),
) func(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	mw := func(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
		user := r.Context().Value(ContextKey("User")).(models.User)
		_, err := env.Photos.GetFirstByUserId(user.Id)
		if !user.Active || user.Gender == "" || len(user.GenderPreferences) <= 0 || err != nil {
			return nil, errors.HttpError{Status: 403, Body: nil}
		}
		return inner(env, w, r)
	}
	return AuthRequired(mw)
}

func WsAuth(
	inner func(env *Env, w http.ResponseWriter, r *http.Request) (any, error),
) func(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	mw := func(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
		tokenCookie, err := r.Cookie("token")
		if err != nil {
			lib.HttpJsonError(w, map[string]string{}, 401)
			return nil, nil
		}
		r.Header.Add("Authorization", fmt.Sprintf("Bearer %s", tokenCookie.Value))
		return inner(env, w, r)
	}
	return mw
}
