FROM golang:1.21

WORKDIR /usr/src/app

RUN curl -s https://packagecloud.io/install/repositories/golang-migrate/migrate/script.deb.sh | bash && \
        apt-get update && \
        apt-get upgrade -y && \
        apt-get install -y migrate

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /usr/local/bin/app main.go
RUN chmod a+x ./run.sh

RUN mkdir -p /usr/share/uploads

EXPOSE 8000

CMD ["./run.sh"]
