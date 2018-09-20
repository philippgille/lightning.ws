package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// ocrHandler reads a URL from the query parameters and returns the detected text as JSON.
// See https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/
// and https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/
func ocrHandler(c *gin.Context) {
	uriBase := "https://" + *visionRegion + ".api.cognitive.microsoft.com"
	uriPath := "/vision/v2.0/ocr"

	// Read the URL of the image from the query parameters
	imageURL := c.Query("imageUrl")
	if imageURL == "" {
		c.String(http.StatusBadRequest, "There's no URL of an image to analyze in the query parameters")
		c.Abort()
		return
	}

	params := "?detectOrientation=true"

	uri := uriBase + uriPath + params
	client := &http.Client{
		Timeout: time.Second * 2,
	}

	reader := strings.NewReader("{\"url\" : \"" + imageURL + "\"}")

	req, err := http.NewRequest("POST", uri, reader)
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("An error occurred during creating the request to the OCR service: %v\n", err))
		c.Abort()
		return
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Ocp-Apim-Subscription-Key", *visionAPIkey)

	resp, err := client.Do(req)
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("An error occurred during the request to the OCR service: %v\n", err))
		c.Abort()
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	var f interface{}
	json.Unmarshal(body, &f)

	jsonFormatted, err := json.MarshalIndent(f, "", "  ")
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("An error occurred during producing the response JSON: %v\n", err))
		c.Abort()
		return
	}
	c.Data(http.StatusOK, "application/json", jsonFormatted)
}
