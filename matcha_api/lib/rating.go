package lib

import "matcha_api/models"

func NormalizeRating(users *models.UserModel, rating int) float64 {
	maxRating, err := users.GetMaxRating()
	if err != nil {
		return 0
	}
	if maxRating == 0 {
		return 0
	} else {
		return float64(rating) / float64(maxRating) * 5.0
	}
}
