package sockets

type PrivateMessage struct {
	UserId  int
	Message any
}

type Hub struct {
	Clients    map[*Client]bool
	Users      map[int]*Client
	Private    chan PrivateMessage
	Broadcasts chan any
	Register   chan *Client
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Private:    make(chan PrivateMessage),
		Broadcasts: make(chan any),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Users:      make(map[int]*Client),
	}
}

func (h *Hub) IsUserOnline(id int) bool {
	_, ok := h.Users[id]
	return ok
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
			h.Users[client.UserId] = client
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				delete(h.Users, client.UserId)
				close(client.Send)
			}
		case message := <-h.Broadcasts:
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
					delete(h.Users, client.UserId)
				}
			}
		case message := <-h.Private:
			client, ok := h.Users[message.UserId]
			if ok {
				select {
				case client.Send <- message.Message:
				default:
					close(client.Send)
					delete(h.Clients, client)
					delete(h.Users, client.UserId)
				}
			}
		}
	}
}
