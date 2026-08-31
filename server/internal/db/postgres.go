package db

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type EndpointModel struct {
	ID            string    `gorm:"primaryKey" json:"id"`
	Hostname      string    `json:"hostname"`
	IPAddress     string    `json:"ip_address"`
	OS            string    `json:"os"`
	Status        string    `json:"status"`
	AgentVersion  string    `json:"agent_version"`
	DecoysActive  int       `json:"decoys_active"`
	CPUUsage      float64   `json:"cpu_usage"`
	LastHeartbeat time.Time `json:"last_heartbeat"`
}

type AlertModel struct {
	ID                string    `gorm:"primaryKey" json:"id"`
	EndpointID        string    `json:"endpoint_id"`
	PID               uint32    `json:"pid"`
	ProcessName       string    `json:"process_name"`
	ThreatScore       float64   `json:"threat_score"`
	CriticalityWeight float64   `json:"criticality_weight"`
	TriggeredRule     string    `json:"triggered_rule"`
	TargetPaths       string    `json:"target_paths"` // stored as JSON string
	IsDecoyTrigger    bool      `json:"is_decoy_trigger"`
	ActionTaken       string    `json:"action_taken"`
	CreatedAt         time.Time `json:"created_at"`
}

type PolicyModel struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PathPattern string    `gorm:"unique" json:"path_pattern"`
	Weight      float64   `json:"weight"`
	Description string    `json:"description"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Database struct {
	DB *gorm.DB
}

func InitDB(dsn string) (*Database, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("[DB] Warning: Could not connect to Postgres (%v). Operating in-memory mode.", err)
		return &Database{DB: nil}, nil
	}

	err = db.AutoMigrate(&EndpointModel{}, &AlertModel{}, &PolicyModel{})
	if err != nil {
		log.Printf("[DB] AutoMigrate warning: %v", err)
	}

	return &Database{DB: db}, nil
}
