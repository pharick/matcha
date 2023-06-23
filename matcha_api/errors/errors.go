package errors

import (
	"fmt"
	"net/http"
)

type ValidationError struct {
	Field string `json:"field"`
	Tag   string `json:"tag"`
}

type HttpError struct {
	Status int
	Body   any
}

func (err HttpError) Error() string {
	return fmt.Sprintf("%d %s", err.Status, http.StatusText(err.Status))
}

type HttpValidationError struct {
	Status int
	Errors []ValidationError
}

func (err HttpValidationError) Error() string {
	return fmt.Sprintf("%d %s", err.Status, http.StatusText(err.Status))
}
