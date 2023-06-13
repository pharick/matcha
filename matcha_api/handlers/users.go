package handlers

import (
	"encoding/json"
	"matcha_api/schemas"
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

	ret := schemas.UserReturn{
		Id:        user.Id,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
	json.NewEncoder(w).Encode(ret)
}
