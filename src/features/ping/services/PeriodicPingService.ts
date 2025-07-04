import { pingApi } from '../api/pingApi';
import { PingResponse, AuthenticatedPingResponse, HealthCheckResponse, PeriodicPingConfig } from '../core/_models';

export interface PingResult {
  success: boolean;
  timestamp: Date;
  response?: PingResponse | AuthenticatedPingResponse | HealthCheckResponse;
  error?: string;
  responseTime: number;
}

export class PeriodicPingService {
  private intervalId: NodeJS.Timeout | null = null;
  private config: PeriodicPingConfig;
  private onResult: (result: PingResult) => void;
  private onError: (error: string) => void;

  constructor(
    config: PeriodicPingConfig,
    onResult: (result: PingResult) => void,
    onError: (error: string) => void
  ) {
    this.config = config;
    this.onResult = onResult;
    this.onError = onError;
  }

  start(): void {
    if (this.intervalId) {
      this.stop();
    }

    if (!this.config.enabled || this.config.interval < 1) {
      return;
    }

    // Initial ping
    this.performPing();

    // Set up periodic pinging
    this.intervalId = setInterval(() => {
      this.performPing();
    }, this.config.interval * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateConfig(newConfig: Partial<PeriodicPingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart if currently running
    if (this.intervalId) {
      this.start();
    }
  }

  private async performPing(): Promise<void> {
    const startTime = Date.now();
    
    try {
      let response: PingResponse | AuthenticatedPingResponse | HealthCheckResponse;
      
      switch (this.config.endpoint) {
        case 'ping':
          response = await pingApi.ping();
          break;
        case 'auth':
          response = await pingApi.authenticatedPing();
          break;
        case 'health':
          response = await pingApi.healthCheck();
          break;
        default:
          throw new Error(`Unknown endpoint: ${this.config.endpoint}`);
      }

      const responseTime = Date.now() - startTime;
      
      const result: PingResult = {
        success: true,
        timestamp: new Date(),
        response,
        responseTime,
      };

      this.onResult(result);

      // Check if we should alert for health issues
      if (this.config.autoAlert && this.config.endpoint === 'health') {
        const healthResponse = response as HealthCheckResponse;
        if (healthResponse.status !== 'Healthy') {
          this.onError(`Health check failed: ${healthResponse.status}`);
        }
      }

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      const result: PingResult = {
        success: false,
        timestamp: new Date(),
        error: errorMessage,
        responseTime,
      };

      this.onResult(result);
      
      if (this.config.autoAlert) {
        this.onError(`Ping failed: ${errorMessage}`);
      }
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  getConfig(): PeriodicPingConfig {
    return { ...this.config };
  }
} 