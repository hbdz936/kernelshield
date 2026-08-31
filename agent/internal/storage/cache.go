package storage

import (
	"sync"
	"time"
)

type CacheItem struct {
	Value      interface{}
	Expiration int64
}

// MemoryCache is a light thread-safe TTL cache
type MemoryCache struct {
	items map[string]CacheItem
	mu    sync.RWMutex
}

// NewMemoryCache constructs MemoryCache
func NewMemoryCache() *MemoryCache {
	mc := &MemoryCache{
		items: make(map[string]CacheItem),
	}
	go mc.startCleanup()
	return mc
}

// Set stores a value with TTL
func (mc *MemoryCache) Set(key string, value interface{}, ttl time.Duration) {
	mc.mu.Lock()
	defer mc.mu.Unlock()
	mc.items[key] = CacheItem{
		Value:      value,
		Expiration: time.Now().Add(ttl).UnixNano(),
	}
}

// Get retrieves item if valid
func (mc *MemoryCache) Get(key string) (interface{}, bool) {
	mc.mu.RLock()
	defer mc.mu.RUnlock()

	item, exists := mc.items[key]
	if !exists || time.Now().UnixNano() > item.Expiration {
		return nil, false
	}
	return item.Value, true
}

func (mc *MemoryCache) startCleanup() {
	ticker := time.NewTicker(30 * time.Second)
	for range ticker.C {
		mc.mu.Lock()
		now := time.Now().UnixNano()
		for k, v := range mc.items {
			if now > v.Expiration {
				delete(mc.items, k)
			}
		}
		mc.mu.Unlock()
	}
}
