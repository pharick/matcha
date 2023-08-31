package schemas

type ChatMessageReturn struct {
	Id         int    `json:"id"`
	FromUserId int    `json:"from_user_id"`
	ToUserId   int    `json:"to_user_id"`
	Text       string `json:"text"`
}

type NewChatMessage struct {
	Text string `json:"text"`
}
