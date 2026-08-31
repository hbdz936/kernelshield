package notifier

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type WebhookNotifier struct {
	WebhookURL string
}

func NewWebhookNotifier(url string) *WebhookNotifier {
	return &WebhookNotifier{WebhookURL: url}
}

func (w *WebhookNotifier) SendAlert(alert interface{}) {
	if w.WebhookURL == "" {
		return
	}

	data, err := json.Marshal(alert)
	if err != nil {
		return
	}

	req, err := http.NewRequest("POST", w.WebhookURL, bytes.NewBuffer(data))
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err == nil && resp != nil {
		resp.Body.Close()
		log.Println("[WebhookNotifier] Dispatch notification success.")
	}
}
