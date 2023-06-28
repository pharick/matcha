package schemas

type PhotoReturn struct {
	Id     int    `json:"id"`
	UserId int    `json:"user_id"`
	Url    string `json:"url"`
}

type PhotosReturn struct {
	List []PhotoReturn `json:"list"`
}
