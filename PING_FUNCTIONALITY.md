# Ping Functionality for Syllabus Client

## Overview
The ping functionality provides a way to test API connectivity and health status. It includes both public and authenticated endpoints to verify that the API is running and accessible.

## Backend Implementation

### PingController (`SyllabusAPI/Controllers/PingController.cs`)
- **Public Endpoint**: `GET /ping` - Tests basic API connectivity
- **Authenticated Endpoint**: `GET /ping/auth` - Tests API connectivity with authentication

### API Contracts
- `PingResponseApiDTO` - Response model for public ping
- `AuthenticatedPingResponseApiDTO` - Response model for authenticated ping (extends public response)

## Frontend Implementation

### Models (`src/features/ping/core/_models.ts`)
```typescript
export interface PingResponse {
  message: string;
  timestamp: string;
  version: string;
}

export interface AuthenticatedPingResponse extends PingResponse {
  userId?: string;
  userEmail?: string;
}
```

### API Client (`src/features/ping/api/pingApi.ts`)
- Uses axios with JWT expiration handling
- Includes request and response interceptors
- Handles 401 responses by redirecting to login

### Custom Hook (`src/features/ping/hooks/usePing.ts`)
- Manages ping state (data, loading, error)
- Provides `ping()` and `authenticatedPing()` functions
- Includes comprehensive error handling for different HTTP status codes

### UI Component (`src/features/ping/pages/PingPage.tsx`)
- Displays both public and authenticated ping results
- Shows connection status summary
- Includes loading states and error handling
- Responsive design using Material-UI

## Features

### Public Ping
- Tests basic API connectivity without authentication
- Shows API message, version, and timestamp
- Available to all users (logged in or not)

### Authenticated Ping
- Tests API connectivity with JWT authentication
- Shows user information (ID, email) if authenticated
- Only available to logged-in users
- Automatically handles JWT expiration

### Error Handling
- **404**: API endpoint not found
- **401**: Authentication required (for authenticated ping)
- **500**: Server error
- **Network errors**: No response from server
- **JWT expiration**: Automatic logout and redirect

### UI Features
- **Loading states**: Shows spinner during API calls
- **Error display**: Shows error messages with close functionality
- **Status summary**: Shows connection status for both endpoints
- **Responsive design**: Works on mobile and desktop
- **Authentication awareness**: Shows warning if not logged in

## Usage

### Accessing the Ping Page
1. Navigate to `/ping` in the application
2. Available from the main navigation menu as "API Health"
3. Accessible to both authenticated and non-authenticated users

### Testing API Connectivity
1. **Public Ping**: Click "Ping API" to test basic connectivity
2. **Authenticated Ping**: Click "Ping Authenticated API" (requires login)
3. **View Results**: See API response details and connection status

### Integration with JWT Expiration
- The ping functionality integrates with the JWT expiration system
- If a token expires during a ping request, the user is automatically logged out
- This provides a way to test the JWT expiration handling

## Benefits

1. **Health Monitoring**: Quickly check if the API is running
2. **Debugging**: Identify connectivity issues
3. **Authentication Testing**: Verify JWT token validity
4. **User Experience**: Provide clear feedback about API status
5. **Development Tool**: Useful for development and testing

## Technical Details

### API Endpoints
- `GET /ping` - Returns basic API status
- `GET /ping/auth` - Returns API status with user info (requires JWT)

### Response Format
```json
{
  "message": "API is running",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0"
}
```

### Authenticated Response Format
```json
{
  "message": "API is running and user is authenticated",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0",
  "userId": "user-id",
  "userEmail": "user@example.com"
}
```

## Files Created/Modified

### Backend
- `SyllabusAPI/Controllers/PingController.cs` (new)
- `Syllabus.ApiContracts/Ping/PingResponseApiDTO.cs` (new)
- `Syllabus.ApiContracts/Ping/AuthenticatedPingResponseApiDTO.cs` (new)

### Frontend
- `src/features/ping/core/_models.ts` (new)
- `src/features/ping/api/pingApi.ts` (new)
- `src/features/ping/hooks/usePing.ts` (new)
- `src/features/ping/pages/PingPage.tsx` (new)
- `src/features/ping/index.ts` (new)
- `src/app/router.tsx` (modified)
- `src/app/layouts/MainLayout.tsx` (modified)

This ping functionality provides a solid foundation for testing API connectivity and will be useful for implementing proper error messages in the future. 