package handlers

import (
	"fmt"
	"log"
	"net/http"
)

type HttpError struct {
	Status int
}

func (err HttpError) Error() string {
	return fmt.Sprintf("%d %s", err.Status, http.StatusText(err.Status))
}

type Handler struct {
	Env    *Env
	Handle func(env *Env, w http.ResponseWriter, r *http.Request) error
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := h.Handle(h.Env, w, r)
	if err != nil {
		switch err := err.(type) {
		case HttpError:
			http.Error(w, err.Error(), err.Status)
		default:
			log.Print(err)
			http.Error(
				w,
				fmt.Sprintf("500 %s", http.StatusText(http.StatusInternalServerError)),
				http.StatusInternalServerError,
			)
		}
	}
}
