"use client";

import { useEffect, useState } from 'react';
import { TelemetryPoint } from '../types';
import { mockTelemetrySeries } from '../mock/mockData';

export function useTelemetry() {
  const [data, setData] = useState<TelemetryPoint[]>(mockTelemetrySeries);
  const [loading, setLoading] = useState<boolean>(false);

  return { data, loading };
}
