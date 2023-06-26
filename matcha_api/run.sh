#!/bin/sh

while !(migrate -database postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/matcha?sslmode=disable -path migrations up)
do
        echo "Migration is not successful. Trying again..."
done
app
