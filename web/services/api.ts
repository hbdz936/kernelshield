const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API HTTP Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[KernelShield API] Request to ${endpoint} failed. Using fallback mock layer.`, error);
    return null;
  }
}
