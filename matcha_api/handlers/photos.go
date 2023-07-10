package handlers

import (
	"database/sql"
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/models"
	"matcha_api/schemas"
	"net/http"
	"strconv"

	"goji.io/pat"
)

func PhotoList(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	photos, err := env.Photos.GetAllByUserId(user.Id)
	if err != nil {
		return nil, err
	}
	photosRet := lib.Map(photos, func(photo models.Photo) schemas.PhotoReturn {
		return schemas.PhotoReturn{
			Id:     photo.Id,
			UserId: photo.UserId,
			Index:  photo.Index,
			Url:    photo.Url,
		}
	})
	ret := schemas.PhotosReturn{
		List: photosRet,
	}
	return ret, nil
}

func GetPhoto(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	id, err := strconv.Atoi(pat.Param(r, "id"))
	if err != nil {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	photo, err := env.Photos.GetOneById(id)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	if photo.UserId != user.Id {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	ret := schemas.PhotoReturn{
		Id:     photo.Id,
		UserId: photo.UserId,
		Index:  photo.Index,
		Url:    photo.Url,
	}
	return ret, nil
}

func UpdatePhoto(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	id, err := strconv.Atoi(pat.Param(r, "id"))
	if err != nil {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	photo, err := env.Photos.GetOneById(id)
	if err == sql.ErrNoRows {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	if err != nil {
		return nil, err
	}
	if photo.UserId != user.Id {
		return nil, errors.HttpError{Status: 404, Body: nil}
	}
	var d schemas.UpdatePhotoData
	err = lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	photo.Index = d.Index
	photo, err = env.Photos.Update(photo)
	ret := schemas.PhotoReturn{
		Id:     photo.Id,
		UserId: photo.UserId,
		Index:  photo.Index,
		Url:    photo.Url,
	}
	return ret, nil
}

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
	ret := schemas.PhotoReturn{
		Id:     photo.Id,
		UserId: photo.UserId,
		Index:  photo.Index,
		Url:    photo.Url,
	}
	return ret, nil
}
