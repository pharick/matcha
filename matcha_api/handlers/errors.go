package handlers

import (
	"database/sql"
	"log"
	"net/http"
)

func handleError(err error, w http.ResponseWriter) {
	switch err {
	case sql.ErrNoRows:
		http.Error(w, "404 page not found", 404)
	default:
		log.Println(err)
		http.Error(w, "", 500)
	}
}
