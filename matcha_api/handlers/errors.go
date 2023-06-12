package handlers

import (
	"log"
	"net/http"
)

var codes = map[int]string{
	401: "401 unauthorized",
	404: "404 page not found",
	409: "409 conflict",
	422: "422 unprocessable content",
	500: "500 internal server error",
}

func handleError(w http.ResponseWriter, err error, status int) {
	log.Println(err)
	http.Error(w, codes[status], status)
}
