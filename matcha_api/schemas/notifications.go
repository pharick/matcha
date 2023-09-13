package schemas

type NotificationReturn struct {
	Id         int    `json:"id"`
	Type       string `json:"type"`
	Username   string `json:"username"`
	CreateTime string `json:"create_time"`
	Viewed     bool   `json:"viewed"`
}

type NotificationsReturn struct {
	List  []NotificationReturn `json:"list"`
	Total int                  `json:"total"`
}
