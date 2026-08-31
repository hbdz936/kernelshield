package engine

import (
	"log"
	"sync"
	"time"
)

// ThreatAlert represents a correlated ransomware threat detection
type ThreatAlert struct {
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

// PIDWindow tracks signals within sliding window
type PIDWindow struct {
	PID          uint32
	ProcessName  string
	Signals      []Signal
	FirstSeen    time.Time
	LastSeen     time.Time
	MaxWeight    float64
	HasDecoy     bool
	TargetPaths  map[string]bool
}

// DecisionEngine correlates signals by PID in a 5-second sliding window
type DecisionEngine struct {
	queue        *SignalQueue
	responder    *Responder
	windows      map[uint32]*PIDWindow
	mu           sync.Mutex
	windowLength time.Duration
	stopChan     chan struct{}
	AlertChan    chan ThreatAlert
}

// NewDecisionEngine creates DecisionEngine
func NewDecisionEngine(q *SignalQueue, resp *Responder) *DecisionEngine {
	return &DecisionEngine{
		queue:        q,
		responder:    resp,
		windows:      make(map[uint32]*PIDWindow),
		windowLength: 5 * time.Second,
		stopChan:     make(chan struct{}),
		AlertChan:    make(chan ThreatAlert, 100),
	}
}

// Start launches correlator loop
func (de *DecisionEngine) Start() {
	go de.processQueue()
	go de.cleanupWindows()
}

// Stop stops correlator
func (de *DecisionEngine) Stop() {
	close(de.stopChan)
}

func (de *DecisionEngine) processQueue() {
	for sig := range de.queue.Channel() {
		de.evaluateSignal(sig)
	}
}

func (de *DecisionEngine) evaluateSignal(sig Signal) {
	de.mu.Lock()
	defer de.mu.Unlock()

	win, exists := de.windows[sig.PID]
	if !exists {
		win = &PIDWindow{
			PID:         sig.PID,
			ProcessName: sig.ProcessName,
			Signals:     make([]Signal, 0),
			FirstSeen:   time.Now(),
			MaxWeight:   1.0,
			TargetPaths: make(map[string]bool),
		}
		de.windows[sig.PID] = win
	}

	win.LastSeen = time.Now()
	win.Signals = append(win.Signals, sig)
	if sig.Path != "" {
		win.TargetPaths[sig.Path] = true
	}
	if sig.CriticalityWeight > win.MaxWeight {
		win.MaxWeight = sig.CriticalityWeight
	}

	// USP #1: Instant Kill on Dynamic Decoy Trigger
	if sig.IsDecoy || sig.Type == SignalDecoy {
		win.HasDecoy = true
		alert := ThreatAlert{
			ID:                sig.ID,
			PID:               sig.PID,
			ProcessName:       sig.ProcessName,
			ThreatScore:       100.0,
			CriticalityWeight: win.MaxWeight,
			TriggeredRule:     "USP#1_DYNAMIC_DECOY_INSTANT_KILL",
			TargetPaths:       de.getPathsList(win),
			IsDecoyTrigger:    true,
			ActionTaken:       "KILL_PROCESS_AND_ISOLATE_NETWORK",
			Timestamp:         time.Now(),
		}
		log.Printf("[DECISION ENGINE - INSTANT KILL] Decoy access by PID %d (%s) on %s! Threat Score: 100.0", sig.PID, sig.ProcessName, sig.Path)
		de.responder.ExecuteKill(alert)
		de.AlertChan <- alert
		delete(de.windows, sig.PID)
		return
	}

	// USP #2: Calculate Weighted Threat Score
	// Score = (Entropy_Confidence * Criticality_Weight * 10) + (IO_Confidence * 20)
	var maxEntropy float64
	var maxIO float64
	for _, s := range win.Signals {
		if s.EntropyConfidence > maxEntropy {
			maxEntropy = s.EntropyConfidence
		}
		if s.IOConfidence > maxIO {
			maxIO = s.IOConfidence
		}
	}

	score := (maxEntropy * win.MaxWeight * 7.5) + (maxIO * 25.0)

	// Threat Threshold = 65.0
	if score >= 65.0 {
		alert := ThreatAlert{
			ID:                sig.ID,
			PID:               sig.PID,
			ProcessName:       sig.ProcessName,
			ThreatScore:       score,
			CriticalityWeight: win.MaxWeight,
			TriggeredRule:     "USP#2_CORRELATED_HIGH_ENTROPY_BURST",
			TargetPaths:       de.getPathsList(win),
			IsDecoyTrigger:    false,
			ActionTaken:       "KILL_PROCESS",
			Timestamp:         time.Now(),
		}
		log.Printf("[DECISION ENGINE - RANSOMWARE ALERT] PID %d (%s) exceeded threat score: %.2f (Rule: %s)", sig.PID, sig.ProcessName, score, alert.TriggeredRule)
		de.responder.ExecuteKill(alert)
		de.AlertChan <- alert
		delete(de.windows, sig.PID)
	}
}

func (de *DecisionEngine) getPathsList(win *PIDWindow) []string {
	paths := make([]string, 0, len(win.TargetPaths))
	for p := range win.TargetPaths {
		paths = append(paths, p)
	}
	return paths
}

func (de *DecisionEngine) cleanupWindows() {
	ticker := time.NewTicker(3 * time.Second)
	for {
		select {
		case <-de.stopChan:
			return
		case <-ticker.C:
			de.mu.Lock()
			now := time.Now()
			for pid, win := range de.windows {
				if now.Sub(win.LastSeen) > de.windowLength {
					delete(de.windows, pid)
				}
			}
			de.mu.Unlock()
		}
	}
}
