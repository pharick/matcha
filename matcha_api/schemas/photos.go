package schemas

type PhotoReturn struct {
	Id     int    `json:"id"`
	UserId int    `json:"user_id"`
	Index  int    `json:"index"`
	Url    string `json:"url"`
}

type PhotosReturn struct {
	List []PhotoReturn `json:"list"`
}

type UpdatePhotoData struct {
	Index int `json:"index" validate:"required"`
}
