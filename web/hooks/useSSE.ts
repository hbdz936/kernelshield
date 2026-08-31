"use client";

import { useEffect, useState, useRef } from 'react';
import { SSEService } from '../services/events';

export function useSSE(onMessage?: (data: any) => void) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const sseRef = useRef<SSEService | null>(null);

  useEffect(() => {
    const sse = new SSEService((connected) => setIsConnected(connected));
    sseRef.current = sse;
    sse.connect();

    let unsubscribe: (() => void) | undefined;
    if (onMessage) {
      unsubscribe = sse.subscribe('message', onMessage);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      sse.disconnect();
    };
  }, []);

  return { isConnected };
}
