package context

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

// CriticalityRule defines path glob and weight
type CriticalityRule struct {
	Path   string  `yaml:"path"`
	Weight float64 `yaml:"weight"`
}

// CriticalityConfig holds parsed YAML rules
type CriticalityConfig struct {
	Rules []CriticalityRule `yaml:"rules"`
}

// CriticalityEvaluator calculates path criticality weights
type CriticalityEvaluator struct {
	config CriticalityConfig
}

// NewCriticalityEvaluator loads rules from file or defaults
func NewCriticalityEvaluator(configPath string) *CriticalityEvaluator {
	eval := &CriticalityEvaluator{
		config: CriticalityConfig{
			Rules: []CriticalityRule{
				{Path: "/home/*/finance", Weight: 10.0},
				{Path: "/var/www", Weight: 7.0},
				{Path: "/etc", Weight: 9.0},
				{Path: "/tmp", Weight: 1.0},
			},
		},
	}

	if configPath != "" {
		data, err := os.ReadFile(configPath)
		if err == nil {
			var cfg CriticalityConfig
			if err := yaml.Unmarshal(data, &cfg); err == nil {
				eval.config = cfg
				log.Printf("[CriticalityEvaluator] Loaded %d rules from %s", len(cfg.Rules), configPath)
			}
		}
	}

	return eval
}

// GetWeight matches path against rules and returns highest weight (default 1.0)
func (ce *CriticalityEvaluator) GetWeight(filePath string) float64 {
	cleanPath := filepath.Clean(filePath)
	maxWeight := 1.0

	for _, rule := range ce.config.Rules {
		matched := false
		
		// Direct prefix check or glob match
		if strings.HasPrefix(cleanPath, strings.TrimSuffix(rule.Path, "*")) {
			matched = true
		} else {
			matched, _ = filepath.Match(rule.Path, cleanPath)
		}

		if matched && rule.Weight > maxWeight {
			maxWeight = rule.Weight
		}
	}

	return maxWeight
}
