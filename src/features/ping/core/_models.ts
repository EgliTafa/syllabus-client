export interface PingResponse {
  message: string;
  timestamp: string;
  version: string;
}

export interface AuthenticatedPingResponse extends PingResponse {
  userId?: string;
  userEmail?: string;
} 