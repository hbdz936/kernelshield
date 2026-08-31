package grpc

import (
	"log"
	"time"
)

type AgentManager struct {
	ActiveAgents map[string]time.Time
}

func NewAgentManager() *AgentManager {
	return &AgentManager{
		ActiveAgents: make(map[string]time.Time),
	}
}

func (am *AgentManager) RecordHeartbeat(agentID string) {
	am.ActiveAgents[agentID] = time.Now()
	log.Printf("[AgentManager] Agent heartbeat registered: %s", agentID)
}
