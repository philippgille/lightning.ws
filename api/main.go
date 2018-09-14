package main

import (
	"flag"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/philippgille/ln-paywall/ln"
	"github.com/philippgille/ln-paywall/storage"
	"github.com/philippgille/ln-paywall/wall"
)

// General config

var lndAddress = flag.String("addr", "localhost:10009", "Address of the lnd node (including gRPC port)")
var dataDir = flag.String("dataDir", "data/", "Relative path to the data directory, where tls.cert and invoice.macaroon are located")

// Endpoint-specific config

var qrPrice = flag.Int64("qrPrice", 1000, "Price of one request in Satoshis (at an exchange rate of $1,000 for 1 BTC 1000 Satoshis would be $0.01)")

var translateAPIKey = flag.String("translateApiKey", "", "Azure Cognitive Services subscription key for the \"Translator Text API\"")
var translatePrice = flag.Int64("translatePrice", 1000, "Price of one request in Satoshis (at an exchange rate of $1,000 for 1 BTC 1000 Satoshis would be $0.01)")

func main() {
	flag.Parse()

	// Make sure the path to the data directory ends with "/"
	dataDirSuffixed := *dataDir
	if !strings.HasSuffix(dataDirSuffixed, "/") {
		dataDirSuffixed += "/"
	}

	r := gin.Default()

	// Configure middleware - endpoint independent

	// LN client
	lndOptions := ln.LNDoptions{
		Address:      *lndAddress,
		CertFile:     dataDirSuffixed + "tls.cert",
		MacaroonFile: dataDirSuffixed + "invoice.macaroon",
	}
	lnClient, err := ln.NewLNDclient(lndOptions)
	if err != nil {
		panic(err)
	}

	// Storage
	boltOptions := storage.BoltOptions{
		Path: dataDirSuffixed + "ln-paywall.db",
	}
	storageClient, err := storage.NewBoltClient(boltOptions)
	if err != nil {
		panic(err)
	}

	// Configure middleware - endpoint specific

	// Invoice for QR code
	qrInvoiceOptions := wall.InvoiceOptions{
		Memo:  "QR code generation API call",
		Price: *qrPrice,
	}
	// Invoice for Translation
	translateInvoiceOptions := wall.InvoiceOptions{
		Memo:  "Translation API call",
		Price: *translatePrice,
	}

	// Use middleware - per route

	r.GET("/qr", wall.NewGinMiddleware(qrInvoiceOptions, lnClient, storageClient), qrHandler)
	r.GET("/translate", wall.NewGinMiddleware(translateInvoiceOptions, lnClient, storageClient), translationHandler)

	r.Run() // Listen and serve on 0.0.0.0:8080
}
