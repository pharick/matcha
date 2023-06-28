package lib

import (
	"fmt"
	"io"
	"matcha_api/errors"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/exp/slices"
)

func UploadFile(r *http.Request, fieldName string, types []string, subdir string) (url string, err error) {
	UPLOADS_PATH := "/usr/share/uploads"
	err = r.ParseMultipartForm(10 << 20)
	if err != nil {
		return "", err
	}
	file, fileHandler, err := r.FormFile(fieldName)
	if err != nil {
		return "", err
	}
	defer file.Close()
	// check filetype
	buff := make([]byte, 512)
	_, err = file.Read(buff)
	if err != nil {
		return "", err
	}
	filetype := http.DetectContentType(buff)
	if slices.IndexFunc(types, func(t string) bool { return t == filetype }) < 0 {
		return "", errors.HttpError{Status: 422, Body: nil}
	}
	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return "", err
	}
	// check filetype end
	err = os.MkdirAll(fmt.Sprintf("%s/%s", UPLOADS_PATH, subdir), os.ModePerm)
	if err != nil {
		return "", err
	}
	path := fmt.Sprintf("%s/%s%s", subdir, strings.Replace(uuid.New().String(), "-", "", -1), filepath.Ext(fileHandler.Filename))
	dest, err := os.Create(fmt.Sprintf("%s/%s", UPLOADS_PATH, path))
	if err != nil {
		return "", err
	}
	defer dest.Close()
	_, err = io.Copy(dest, file)
	url = fmt.Sprintf("/uploads/%s", path)
	return url, nil
}
