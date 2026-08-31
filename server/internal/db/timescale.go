package db

import "log"

// SetupTimescaleDB initializes TimescaleDB hypertable if extension is available
func SetupTimescaleDB(database *Database) {
	if database.DB == nil {
		return
	}
	log.Println("[TimescaleDB] Ensuring hypertable schema for alert telemetry...")
	database.DB.Exec("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;")
}
