"use client";

import { useEffect, useState } from 'react';
import { Endpoint } from '../types';
import { getEndpoints } from '../services/endpoints';

export function useEndpoints() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getEndpoints().then((data) => {
      setEndpoints(data);
      setLoading(false);
    });
  }, []);

  return { endpoints, loading };
}
