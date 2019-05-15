# Builder image
FROM golang:1.12-alpine as builder

RUN apk add git

WORKDIR /go/src/app
COPY *.go ./

RUN go env && go list -deps

RUN go get -v ./...
RUN go build -v

# Runtime image
FROM alpine

LABEL maintainer "Philipp Gille"

# CA certificates for example for the request to the Azure API
RUN apk add --no-cache ca-certificates

WORKDIR /root/
COPY --from=builder /go/src/app/app ./
RUN mkdir data/

# Volume for invoice.macaroon, tls.cert and embedded DB
VOLUME [ "/root/data/" ]
EXPOSE 8080

ENTRYPOINT ["./app"]
CMD ["-help"]
