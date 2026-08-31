package v1

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type PolicyRule struct {
	ID          int       `json:"id"`
	Path        string    `json:"path"`
	Weight      float64   `json:"weight"`
	Description string    `json:"description"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type PolicyStore struct {
	rules []PolicyRule
	mu    sync.RWMutex
}

var globalPolicies = &PolicyStore{
	rules: []PolicyRule{
		{ID: 1, Path: "/home/*/finance", Weight: 10.0, Description: "Financial and accounting directories", UpdatedAt: time.Now()},
		{ID: 2, Path: "/var/www", Weight: 7.0, Description: "Web application document root", UpdatedAt: time.Now()},
		{ID: 3, Path: "/etc", Weight: 9.0, Description: "System configuration directory", UpdatedAt: time.Now()},
		{ID: 4, Path: "/tmp", Weight: 1.0, Description: "Temporary scratch folder", UpdatedAt: time.Now()},
	},
}

func HandleGetPolicies(c *gin.Context) {
	globalPolicies.mu.RLock()
	defer globalPolicies.mu.RUnlock()

	c.JSON(http.StatusOK, gin.H{
		"total":    len(globalPolicies.rules),
		"policies": globalPolicies.rules,
	})
}

func HandlePostPolicy(c *gin.Context) {
	var rule PolicyRule
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	globalPolicies.mu.Lock()
	defer globalPolicies.mu.Unlock()

	rule.ID = len(globalPolicies.rules) + 1
	rule.UpdatedAt = time.Now()
	globalPolicies.rules = append(globalPolicies.rules, rule)

	c.JSON(http.StatusCreated, gin.H{"status": "policy_created", "policy": rule})
}
