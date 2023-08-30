package schemas

type ChatMessage struct {
	Me   bool   `json:"me"`
	Text string `json:"text"`
}
