package handlers

import (
	"log"
	"matcha_api/lib"
	"net/http"
)

func UploadPhoto(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	// username := pat.Param(r, "username")
	url, err := lib.UploadFile(r, "photo", []string{"image/jpeg", "image/png"}, "photos")
	if err != nil {
		return nil, err
	}
	log.Println(url)
	return nil, nil
}
