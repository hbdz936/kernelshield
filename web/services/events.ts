type EventCallback = (data: any) => void;

export class SSEService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  public isConnected: boolean = false;
  private onStatusChange?: (connected: boolean) => void;

  constructor(onStatusChange?: (connected: boolean) => void) {
    this.onStatusChange = onStatusChange;
  }

  public connect(url: string = 'http://localhost:8080/api/v1/alerts/stream') {
    if (typeof window === 'undefined') return;

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.isConnected = true;
        if (this.onStatusChange) this.onStatusChange(true);
      };

      this.eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.emit('message', parsed);
        } catch (e) {
          this.emit('message', event.data);
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        if (this.onStatusChange) this.onStatusChange(false);
      };
    } catch (e) {
      this.isConnected = false;
      if (this.onStatusChange) this.onStatusChange(false);
    }
  }

  public subscribe(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.unsubscribe(event, callback);
  }

  public unsubscribe(event: string, callback: EventCallback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => cb(data));
    }
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
    if (this.onStatusChange) this.onStatusChange(false);
  }
}
