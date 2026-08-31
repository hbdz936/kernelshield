package context

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"text/template"
)

// DecoyFile holds metadata about active trap files
type DecoyFile struct {
	Path        string `json:"path"`
	FileType    string `json:"file_type"`
	CreatedTime int64  `json:"created_time"`
}

// DecoyManager handles scanning, deployment, and detection of trap decoy files
type DecoyManager struct {
	decoyMap map[string]DecoyFile
	mu       sync.RWMutex
}

// NewDecoyManager constructs DecoyManager
func NewDecoyManager() *DecoyManager {
	return &DecoyManager{
		decoyMap: make(map[string]DecoyFile),
	}
}

// DeployDecoysInDir scans directory and deploys realistic fake decoys
func (dm *DecoyManager) DeployDecoysInDir(targetDir string) error {
	dm.mu.Lock()
	defer dm.mu.Unlock()

	// Ensure directory exists or create temporary simulation folder
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return err
	}

	decoyNames := []struct {
		Name string
		Type string
	}{
		{"Q4_Financial_Projection_v3.docx", "docx"},
		{"Employee_Salaries_2024_CONFIDENTIAL.xlsx", "xlsx"},
		{"System_Architecture_Backup.pdf", "pdf"},
		{"Master_Encryption_Keys_DoNotDelete.txt", "txt"},
	}

	docTemplate := template.Must(template.New("decoy").Parse(
		"CONFIDENTIAL KERNELSHIELD DECOY FILE [ID: {{.ID}}]\n" +
			"This file contains high-value simulated enterprise data.\n" +
			"Unauthorized modification triggers instant security isolation.\n",
	))

	for _, item := range decoyNames {
		fullPath := filepath.Join(targetDir, item.Name)
		
		// Create file content
		f, err := os.Create(fullPath)
		if err != nil {
			log.Printf("[DecoyManager] Failed to create decoy %s: %v", fullPath, err)
			continue
		}

		err = docTemplate.Execute(f, map[string]string{
			"ID": fmt.Sprintf("%s-%d", item.Type, os.Getpid()),
		})
		f.Close()

		if err == nil {
			dm.decoyMap[filepath.Clean(fullPath)] = DecoyFile{
				Path:        filepath.Clean(fullPath),
				FileType:    item.Type,
				CreatedTime: os.Getenv("NOW_UNIX") != "" ? 0 : 0,
			}
			log.Printf("[DecoyManager] Deployed dynamic trap file: %s", fullPath)
		}
	}

	return nil
}

// IsDecoy checks if a given filepath matches an active dynamic decoy trap
func (dm *DecoyManager) IsDecoy(filePath string) bool {
	dm.mu.RLock()
	defer dm.mu.RUnlock()

	clean := filepath.Clean(filePath)
	_, exists := dm.decoyMap[clean]
	return exists
}

// ListDecoys returns all active deployed trap files
func (dm *DecoyManager) ListDecoys() []DecoyFile {
	dm.mu.RLock()
	defer dm.mu.RUnlock()

	list := make([]DecoyFile, 0, len(dm.decoyMap))
	for _, df := range dm.decoyMap {
		list = append(list, df)
	}
	return list
}
