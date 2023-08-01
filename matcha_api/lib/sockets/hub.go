package sockets

import "log"

type Hub struct {
	Clients    map[*Client]bool
	Users      map[int]*Client
	Broadcasts chan []byte
	Register   chan *Client
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Broadcasts: make(chan []byte),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Users:      make(map[int]*Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client] = true
			h.Users[client.UserId] = client

			log.Printf("Connected userId %v", client.UserId)
		case client := <-h.Unregister:
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				delete(h.Users, client.UserId)
				close(client.Send)
				log.Printf("Disconnected userId %v", client.UserId)
			}
		case message := <-h.Broadcasts:
			for client := range h.Clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.Clients, client)
					delete(h.Users, client.UserId)
					log.Printf("Disconnected userId %v", client.UserId)
				}
			}
		}
	}
}
