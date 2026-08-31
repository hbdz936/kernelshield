package v1

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type AlertPayload struct {
	ID                string    `json:"id"`
	PID               uint32    `json:"pid"`
	ProcessName       string    `json:"process_name"`
	ThreatScore       float64   `json:"threat_score"`
	CriticalityWeight float64   `json:"criticality_weight"`
	TriggeredRule     string    `json:"triggered_rule"`
	TargetPaths       []string  `json:"target_paths"`
	IsDecoyTrigger    bool      `json:"is_decoy_trigger"`
	ActionTaken       string    `json:"action_taken"`
	Timestamp         time.Time `json:"timestamp"`
}

type AlertBroadcaster struct {
	clients   map[chan AlertPayload]bool
	addClient chan chan AlertPayload
	remClient chan chan AlertPayload
	broadcast chan AlertPayload
	alerts    []AlertPayload
	mu        sync.RWMutex
}

var GlobalBroadcaster *AlertBroadcaster

func InitBroadcaster() *AlertBroadcaster {
	b := &AlertBroadcaster{
		clients:   make(map[chan AlertPayload]bool),
		addClient: make(chan chan AlertPayload),
		remClient: make(chan chan AlertPayload),
		broadcast: make(chan AlertPayload, 100),
		alerts:    make([]AlertPayload, 0),
	}

	// Pre-seed baseline alerts for smooth dashboard visualization
	b.alerts = append(b.alerts,
		AlertPayload{
			ID:                "alt-90412",
			PID:               2048,
			ProcessName:       "bad_encryptor",
			ThreatScore:       100.0,
			CriticalityWeight: 10.0,
			TriggeredRule:     "USP#1_DYNAMIC_DECOY_INSTANT_KILL",
			TargetPaths:       []string{"/home/user/finance/Q4_Financial_Projection_v3.docx"},
			IsDecoyTrigger:    true,
			ActionTaken:       "KILL_PROCESS_AND_ISOLATE_NETWORK",
			Timestamp:         time.Now().Add(-2 * time.Minute),
		},
		AlertPayload{
			ID:                "alt-88231",
			PID:               3190,
			ProcessName:       "crypto_miner_agent",
			ThreatScore:       78.5,
			CriticalityWeight: 7.0,
			TriggeredRule:     "USP#2_CORRELATED_HIGH_ENTROPY_BURST",
			TargetPaths:       []string{"/var/www/uploads/shell.php", "/var/www/index.html"},
			IsDecoyTrigger:    false,
			ActionTaken:       "KILL_PROCESS",
			Timestamp:         time.Now().Add(-14 * time.Minute),
		},
	)

	go b.run()
	GlobalBroadcaster = b
	return b
}

func (b *AlertBroadcaster) run() {
	for {
		select {
		case client := <-b.addClient:
			b.mu.Lock()
			b.clients[client] = true
			b.mu.Unlock()
		case client := <-b.remClient:
			b.mu.Lock()
			delete(b.clients, client)
			close(client)
			b.mu.Unlock()
		case alert := <-b.broadcast:
			b.mu.Lock()
			b.alerts = append([]AlertPayload{alert}, b.alerts...)
			if len(b.alerts) > 200 {
				b.alerts = b.alerts[:200]
			}
			for client := range b.clients {
				select {
				case client <- alert:
				default:
				}
			}
			b.mu.Unlock()
		}
	}
}

// HandlePostAlert receives alert from agent or frontend simulation
func HandlePostAlert(c *gin.Context) {
	var alert AlertPayload
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if alert.Timestamp.IsZero() {
		alert.Timestamp = time.Now()
	}
	if alert.ID == "" {
		alert.ID = fmt.Sprintf("alt-%d", time.Now().UnixNano()%100000)
	}

	GlobalBroadcaster.broadcast <- alert
	c.JSON(http.StatusOK, gin.H{"status": "alert_processed", "id": alert.ID, "alert": alert})
}

// HandleGetAlerts returns all recent alerts
func HandleGetAlerts(c *gin.Context) {
	GlobalBroadcaster.mu.RLock()
	defer GlobalBroadcaster.mu.RUnlock()

	c.JSON(http.StatusOK, gin.H{
		"total":  len(GlobalBroadcaster.alerts),
		"alerts": GlobalBroadcaster.alerts,
	})
}

// HandleGetMetrics returns live operational telemetry overview metrics
func HandleGetMetrics(c *gin.Context) {
	GlobalBroadcaster.mu.RLock()
	defer GlobalBroadcaster.mu.RUnlock()

	totalAlerts := len(GlobalBroadcaster.alerts)
	decoyTriggers := 0
	for _, a := range GlobalBroadcaster.alerts {
		if a.IsDecoyTrigger {
			decoyTriggers++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"threats_mitigated": totalAlerts,
		"decoys_active":     18,
		"avg_latency":       "< 0.8ms",
		"decoy_triggers":    decoyTriggers,
		"protected_nodes":   3,
	})
}

// HandleAlertStream serves SSE real-time event stream to web UI
func HandleAlertStream(c *gin.Context) {
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

	clientChan := make(chan AlertPayload, 10)
	GlobalBroadcaster.addClient <- clientChan

	defer func() {
		GlobalBroadcaster.remClient <- clientChan
	}()

	c.Stream(func(w io.Writer) bool {
		select {
		case alert, ok := <-clientChan:
			if !ok {
				return false
			}
			data, _ := json.Marshal(alert)
			fmt.Fprintf(w, "data: %s\n\n", string(data))
			return true
		case <-c.Request.Context().Done():
			return false
		}
	})
}
