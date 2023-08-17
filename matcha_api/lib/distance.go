package lib

import (
	"matcha_api/models"
	"math"
)

const R = 6371e3

func CalcDistance(pos1 models.Position, pos2 models.Position) float64 {
	lat1 := pos1.Latitude * math.Pi / 180
	lat2 := pos2.Latitude * math.Pi / 180
	dLat := (pos2.Latitude - pos1.Latitude) * math.Pi / 180
	dLon := (pos2.Longitude - pos1.Longitude) * math.Pi / 180
	a := math.Sin(dLat/2)*math.Sin(dLat/2) + math.Cos(lat1)*math.Cos(lat2)*math.Sin(dLon/2)*math.Sin(dLon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return R * c
}
