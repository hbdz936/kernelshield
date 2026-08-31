"use client";

import { useEffect, useState, useCallback } from 'react';
import { Alert } from '../types';
import { getAlerts, createSimulatedAlert } from '../services/alerts';
import { useSSE } from './useSSE';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    const data = await getAlerts();
    setAlerts(data);
    setLoading(false);
  }, []);

  const handleNewAlert = useCallback((newAlert: Alert) => {
    setAlerts((prev) => {
      const exists = prev.some((a) => a.id === newAlert.id);
      if (exists) return prev;
      return [newAlert, ...prev];
    });
  }, []);

  const { isConnected } = useSSE(handleNewAlert);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const simulateAlert = async () => {
    const newAlert = await createSimulatedAlert({
      pid: Math.floor(1000 + Math.random() * 8000),
      process_name: 'simulated_ransomware_exe',
      threat_score: 100,
      is_decoy_trigger: true,
      action_taken: 'TERMINATE PROCESS + ISOLATE NETWORK',
    });
    handleNewAlert(newAlert);
  };

  return { alerts, loading, isConnected, simulateAlert, refresh: fetchAlerts };
}
