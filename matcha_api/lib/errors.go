package lib

import (
	"encoding/json"
	"net/http"
)

func HttpJsonError(w http.ResponseWriter, body any, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(body)
}
