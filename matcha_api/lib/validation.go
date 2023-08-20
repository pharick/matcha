package lib

import (
	"encoding/json"
	"log"
	"matcha_api/errors"
	"net/http"

	"github.com/go-playground/validator/v10"
)

func GetValidationErrors(err validator.ValidationErrors) []errors.ValidationError {
	errs := make([]errors.ValidationError, 0)
	for _, e := range err {
		errs = append(errs, errors.ValidationError{
			Field: e.Field(),
			Tag:   e.Tag(),
		})
	}
	return errs
}

func GetJSONBody(r *http.Request, d any) error {
	err := json.NewDecoder(r.Body).Decode(d)
	if err != nil {
		return errors.HttpError{Status: 422, Body: nil}
	}
	log.Println(d)
	validate := validator.New()
	err = validate.Struct(d)
	if err, ok := err.(validator.ValidationErrors); ok {
		return errors.HttpValidationError{Status: 422, Errors: GetValidationErrors(err)}
	}
	if err != nil {
		return err
	}
	return nil
}
