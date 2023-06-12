package handlers

import (
	"encoding/json"
	"net/http"

	"goji.io/pat"
)

func (env *Env) UserProfile(w http.ResponseWriter, r *http.Request) {
	username := pat.Param(r, "username")
	user, err := env.Users.GetOneByUsername(username)
	if err != nil {
		handleError(w, err, 404)
		return
	}

	json.NewEncoder(w).Encode(user)
}
