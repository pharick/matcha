#!/bin/sh

migrate -database postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/matcha?sslmode=disable -path migrations up
app
