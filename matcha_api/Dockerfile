FROM golang:1.20

WORKDIR /usr/src/app

RUN apt-get update && \
        apt-get upgrade -y && \
        apt-get install -y lsb-release && curl -L https://packagecloud.io/golang-migrate/migrate/gpgkey | apt-key add - && \
        echo "deb https://packagecloud.io/golang-migrate/migrate/debian/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/migrate.list && \
        apt-get update && \
        apt-get install -y migrate

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o /usr/local/bin/app main.go
RUN chmod a+x ./run.sh

RUN mkdir -p /usr/share/uploads

EXPOSE 8000

CMD ["./run.sh"]
