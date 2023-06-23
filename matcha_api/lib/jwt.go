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
			"sub": username,
			"exp": now.Add(time.Hour).Unix(),
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
			"sub": email,
			"exp": now.Add(time.Hour).Unix(),
		},
	)
	s, err = t.SignedString([]byte(secret))
	return
}

func ParseJWTSub(tokenStr string, secret string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		if method, ok := token.Method.(*jwt.SigningMethodHMAC); !ok || method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil {
		return "", err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		sub := claims["sub"]
		s, ok := sub.(string)
		if !ok {
			return "", fmt.Errorf("sub is not a string")
		}
		return s, nil

	}
	return "", fmt.Errorf("claims is not valid")
}
