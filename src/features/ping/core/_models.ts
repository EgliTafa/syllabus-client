export interface PingResponse {
  message: string;
  timestamp: string;
  version: string;
}

export interface AuthenticatedPingResponse extends PingResponse {
  userId?: string;
  userEmail?: string;
}

export interface HealthCheckItem {
  name: string;
  status: 'Healthy' | 'Warning' | 'Unhealthy';
  responseTime: number;
  message: string;
}

export interface HealthCheckResponse {
  status: 'Healthy' | 'Warning' | 'Unhealthy';
  timestamp: string;
  version: string;
  checks: HealthCheckItem[];
}

export interface PeriodicPingConfig {
  enabled: boolean;
  interval: number; // in seconds
  endpoint: 'ping' | 'auth' | 'health';
  autoAlert: boolean;
} 