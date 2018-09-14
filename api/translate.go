package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func translationHandler(c *gin.Context) {
	const uriBase = "https://api.cognitive.microsofttranslator.com"
	const uriPath = "/translate?api-version=3.0"

	// Which text to translate to
	text := c.Query("text")
	if text == "" {
		c.String(http.StatusBadRequest, "There's no text to translate in the query parameters")
		c.Abort()
		return
	}
	r := strings.NewReader("[{\"Text\" : \"" + text + "\"}]")

	var params string
	// Which language to translate from
	// No "from" language is ok - auto detect is used in that case
	fromLang := c.Query("from")
	if fromLang != "" {
		params += "&from=" + fromLang
	}

	// Which language to translate to
	toLang := c.Query("to")
	if toLang == "" {
		c.String(http.StatusBadRequest, "There's no language to translate to the query parameters")
		c.Abort()
		return
	}
	params += "&to=" + toLang

	uri := uriBase + uriPath + params
	client := &http.Client{
		Timeout: time.Second * 2,
	}

	req, err := http.NewRequest("POST", uri, r)
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("Error creating request: %v\n", err))
		c.Abort()
		return
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Content-Length", strconv.FormatInt(req.ContentLength, len(text)))
	req.Header.Add("Ocp-Apim-Subscription-Key", *translateAPIKey)

	resp, err := client.Do(req)
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("Error on request: %v\n", err))
		c.Abort()
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("Error reading response body: %v\n", err))
		c.Abort()
		return
	}

	var f interface{}
	json.Unmarshal(body, &f)

	jsonFormatted, err := json.MarshalIndent(f, "", "  ")
	if err != nil {
		c.String(http.StatusInternalServerError, fmt.Sprintf("Error producing JSON: %v\n", err))
		c.Abort()
		return
	}
	c.Data(http.StatusOK, "application/json", jsonFormatted)
}
