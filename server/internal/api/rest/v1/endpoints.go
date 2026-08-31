package v1

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type EndpointInfo struct {
	ID            string    `json:"id"`
	Hostname      string    `json:"hostname"`
	IPAddress     string    `json:"ip_address"`
	OS            string    `json:"os"`
	Status        string    `json:"status"`
	AgentVersion  string    `json:"agent_version"`
	DecoysActive  int       `json:"decoys_active"`
	CPUUsage      float64   `json:"cpu_usage"`
	LastHeartbeat time.Time `json:"last_heartbeat"`
}

func HandleGetEndpoints(c *gin.Context) {
	endpoints := []EndpointInfo{
		{
			ID:            "agent-node-linux-01",
			Hostname:      "soc-prod-node-1",
			IPAddress:     "192.168.1.104",
			OS:            "Ubuntu 22.04 LTS (Kernel 6.2)",
			Status:        "PROTECTED",
			AgentVersion:  "1.0.0",
			DecoysActive:  4,
			CPUUsage:      0.38,
			LastHeartbeat: time.Now(),
		},
		{
			ID:            "agent-node-linux-02",
			Hostname:      "k8s-worker-node-02",
			IPAddress:     "192.168.1.112",
			OS:            "Debian 12 Bookworm",
			Status:        "PROTECTED",
			AgentVersion:  "1.0.0",
			DecoysActive:  8,
			CPUUsage:      0.45,
			LastHeartbeat: time.Now().Add(-10 * time.Second),
		},
		{
			ID:            "agent-node-linux-03",
			Hostname:      "db-primary-replica",
			IPAddress:     "192.168.1.200",
			OS:            "RHEL 9.3",
			Status:        "PROTECTED",
			AgentVersion:  "1.0.0",
			DecoysActive:  6,
			CPUUsage:      0.62,
			LastHeartbeat: time.Now().Add(-5 * time.Second),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"total":     len(endpoints),
		"endpoints": endpoints,
	})
}
