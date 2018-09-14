package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	qrcode "github.com/skip2/go-qrcode"
)

func qrHandler(c *gin.Context) {
	data := c.Query("data")
	if data == "" {
		c.String(http.StatusBadRequest, "The query parameter \"data\" is missing")
		c.Abort()
	} else {
		qrBytes, err := qrcode.Encode(data, qrcode.Medium, 256)
		if err != nil {
			c.String(http.StatusInternalServerError, "There was an error encoding the data as QR code")
			c.Abort()
		} else {
			c.Data(http.StatusOK, "image/png", qrBytes)
		}
	}
}
