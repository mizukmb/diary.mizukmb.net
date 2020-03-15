FROM golang:1.13.4-alpine

WORKDIR /backend

COPY . /backend

RUN ["go", "build", "-o", "backend"]

CMD ["/backend/backend"]