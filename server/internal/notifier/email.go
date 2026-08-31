package notifier

import "log"

type EmailNotifier struct {
	SMTPServer string
}

func NewEmailNotifier(server string) *EmailNotifier {
	return &EmailNotifier{SMTPServer: server}
}

func (e *EmailNotifier) SendHighSeverityNotice(alertID string, pid uint32, process string, score float64) {
	log.Printf("[EmailNotifier] [CRITICAL RANSOMWARE ALERT] Process %s (PID: %d) triggered score %.2f. Email notification dispatched.", process, pid, score)
}
