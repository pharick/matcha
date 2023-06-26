package schemas

import "matcha_api/errors"

type ValidationErrorReturn struct {
	Errors []errors.ValidationError `json:"validation_errors"`
}
