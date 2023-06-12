package lib

import "github.com/golang-jwt/jwt/v5"

func GenerateJWT(username string, secret string) (s string, err error) {
	t := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub": username,
		},
	)
	s, err = t.SignedString([]byte(secret))
	return
}
