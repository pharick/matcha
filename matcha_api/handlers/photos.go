package handlers

import (
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
	"net/http"

	"goji.io/pat"
)

func UploadPhoto(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	username := pat.Param(r, "username")
	user := r.Context().Value(ContextKey("User")).(models.User)
	if username != user.Username {
		return nil, errors.HttpError{Status: 403, Body: nil}
	}
	url, err := lib.UploadFile(r, "photo", []string{"image/jpeg", "image/png"}, "photos")
	if err != nil {
		return nil, err
	}
	photo, err := env.Photos.Create(user.Id, url)
	if err != nil {
		return nil, err
	}
	return photo, nil
}
