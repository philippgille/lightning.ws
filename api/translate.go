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

// translationHandler reads a text to translate and language to translate to from the request
// and uses the Azure Cognitive Services "Translator Text API" to translate the text.
// See https://azure.microsoft.com/en-us/services/cognitive-services/translator-text-api/
// and https://docs.microsoft.com/en-us/azure/cognitive-services/translator/
// and https://docs.microsoft.com/en-us/azure/cognitive-services/translator/reference/v3-0-reference
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
	req.Header.Add("Content-Length", strconv.FormatInt(req.ContentLength, 10))
	req.Header.Add("Ocp-Apim-Subscription-Key", *translateAPIkey)

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
