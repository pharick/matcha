package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type HttpError struct {
	Status int
	Body   interface{}
}

func (err HttpError) Error() string {
	return fmt.Sprintf("%d %s", err.Status, http.StatusText(err.Status))
}

func JSONError(w http.ResponseWriter, body interface{}, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(body)
}

type Handler struct {
	Env    *Env
	Handle func(env *Env, w http.ResponseWriter, r *http.Request) (interface{}, error)
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ret, err := h.Handle(h.Env, w, r)
	if err != nil {
		switch err := err.(type) {
		case HttpError:
			if err.Body != nil {
				JSONError(w, err.Body, err.Status)
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
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(ret)
	}
}
