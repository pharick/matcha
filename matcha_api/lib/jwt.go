package lib

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateAuthJWT(username string, secret string) (s string, err error) {
	now := time.Now()
	t := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub":    username,
			"exp":    now.Add(time.Hour * 5).Unix(),
			"target": "auth",
		},
	)
	s, err = t.SignedString([]byte(secret))
	return
}

func GenerateActivationJWT(email string, secret string) (s string, err error) {
	now := time.Now()
	t := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub":    email,
			"exp":    now.Add(time.Hour * 5).Unix(),
			"target": "activation",
		},
	)
	s, err = t.SignedString([]byte(secret))
	return
}

func GeneratePasswordResetJWT(username string, secret string) (s string, err error) {
	now := time.Now()
	t := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub":    username,
			"exp":    now.Add(time.Hour * 5).Unix(),
			"target": "reset",
		},
	)
	s, err = t.SignedString([]byte(secret))
	return
}

func ParseJWT(tokenStr string, secret string) (sub string, target string, err error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		if method, ok := token.Method.(*jwt.SigningMethodHMAC); !ok || method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil {
		return "", "", err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		sub := claims["sub"]
		target := claims["target"]
		s, ok := sub.(string)
		if !ok {
			return "", "", fmt.Errorf("sub is not a string")
		}
		t, ok := target.(string)
		if !ok {
			return "", "", fmt.Errorf("target is not a string")
		}
		return s, t, nil

	}
	return "", "", fmt.Errorf("claims is not valid")
}
