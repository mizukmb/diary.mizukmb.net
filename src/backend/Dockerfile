FROM golang:alpine

WORKDIR /go/src/app

COPY . .

RUN ["go", "build", "-o", "app"]

EXPOSE 80

CMD ["./app"]
