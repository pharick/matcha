package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"matcha_api/errors"
	"matcha_api/lib"
	"matcha_api/schemas"
	"net/http"
)

type Handler struct {
	Env    *Env
	Handle func(env *Env, w http.ResponseWriter, r *http.Request) (any, error)
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ret, err := h.Handle(h.Env, w, r)
	if err != nil {
		switch err := err.(type) {
		case errors.HttpValidationError:
			ret := schemas.ValidationErrorReturn{
				Errors: err.Errors,
			}
			lib.HttpJsonError(w, ret, err.Status)
		case errors.HttpError:
			if err.Body != nil {
				lib.HttpJsonError(w, err.Body, err.Status)
			} else {
				http.Error(w, err.Error(), err.Status)
			}
		default:
			log.Println(err)
			http.Error(
				w,
				fmt.Sprintf("500 %s", http.StatusText(http.StatusInternalServerError)),
				http.StatusInternalServerError,
			)
		}
	} else {
		if ret == nil {
			ret = map[string]string{}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ret)
	}
}
