package handlers

import (
	"matcha_api/lib"
	"matcha_api/schemas"
	"net/http"
)

func FindTag(env *Env, w http.ResponseWriter, r *http.Request) (any, error) {
	var d schemas.FindTagData
	err := lib.GetJSONBody(r, &d)
	if err != nil {
		return nil, err
	}
	tags, err := env.Tags.GetAllContains(d.Value)
	if err != nil {
		return nil, err
	}
	ret := schemas.TagsReturn{
		List: tags,
	}
	return ret, nil
}
