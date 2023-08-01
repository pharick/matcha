package schemas

const (
	NotificationVisit  string = "visit"
	NotificationLike   string = "like"
	NotificationUnlike string = "unlike"
)

type Notification struct {
	Type     string `json:"type"`
	Username string `json:"username"`
}
