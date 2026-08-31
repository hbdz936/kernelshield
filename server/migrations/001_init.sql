-- KernelShield PostgreSQL & TimescaleDB Migration Schema

CREATE TABLE IF NOT EXISTS endpoints (
    id VARCHAR(64) PRIMARY KEY,
    hostname VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    os VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    agent_version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    decoys_active INT DEFAULT 4,
    cpu_usage FLOAT DEFAULT 0.4,
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    endpoint_id VARCHAR(64) REFERENCES endpoints(id) ON DELETE CASCADE,
    pid INT NOT NULL,
    process_name VARCHAR(255) NOT NULL,
    threat_score FLOAT NOT NULL,
    criticality_weight FLOAT NOT NULL,
    triggered_rule VARCHAR(128) NOT NULL,
    target_paths TEXT[] NOT NULL,
    is_decoy_trigger BOOLEAN NOT NULL DEFAULT FALSE,
    action_taken VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS criticality_policies (
    id SERIAL PRIMARY KEY,
    path_pattern VARCHAR(255) NOT NULL UNIQUE,
    weight FLOAT NOT NULL DEFAULT 1.0,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initial default rules
INSERT INTO criticality_policies (path_pattern, weight, description)
VALUES 
    ('/home/*/finance', 10.0, 'Financial and accounting directories'),
    ('/var/www', 7.0, 'Web application document root'),
    ('/etc', 9.0, 'System configuration files'),
    ('/tmp', 1.0, 'Temporary scratch folder')
ON CONFLICT (path_pattern) DO NOTHING;
