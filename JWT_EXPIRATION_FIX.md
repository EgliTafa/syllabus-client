# JWT Expiration Fix for Syllabus Client

## Problem
The syllabus client was keeping users logged in even when their JWT tokens had expired, causing issues where:
- Users appeared to be authenticated but couldn't access protected resources
- API calls would fail with 401 errors but the UI wouldn't redirect to login
- Users would see empty pages or permission errors instead of being redirected to login

## Solution
Implemented a comprehensive JWT expiration handling system with multiple layers of protection:

### 1. JWT Utility Functions (`src/utils/jwtUtils.ts`)
- `decodeToken()`: Safely decodes JWT tokens
- `isTokenExpired()`: Checks if a token has expired
- `getTokenExpirationTime()`: Gets the expiration time of a token
- `getTimeUntilExpiration()`: Calculates time until expiration
- `isTokenExpiringSoon()`: Checks if token will expire within specified time

### 2. Enhanced AuthInitializer (`src/features/auth/core/AuthInitializer.ts`)
- Added token validity check on initialization
- Automatically clears expired tokens from localStorage
- Added `isTokenValid()` method for checking token validity
- Clears both new and legacy token storage

### 3. Global Axios Interceptors
- **Main Axios Instance** (`src/app/axios.ts`): Handles all API requests
- **Auth API** (`src/features/auth/api/authApi.ts`): Specific handling for auth endpoints
- **Syllabus API** (`src/features/syllabus/api/syllabusApi.ts`): Specific handling for syllabus endpoints

All interceptors:
- Check token expiration before making requests
- Handle 401 responses by logging out and redirecting to login
- Clear auth state and localStorage when tokens are invalid

### 4. Auth Interceptor (`src/features/auth/core/AuthInterceptor.ts`)
- Global interceptor that runs periodically (every 30 seconds)
- Checks token validity when page becomes visible
- Handles page refresh scenarios
- Provides utility methods for token management

### 5. Enhanced useAuth Hook (`src/features/auth/hooks/useAuth.ts`)
- Added `checkTokenValidity()` method
- Token validation before making authenticated requests
- Automatic logout on token expiration
- Better error handling for 401 responses

### 6. Token Validation Hook (`src/features/auth/hooks/useTokenValidation.ts`)
- Custom hook for components that need token validation
- Periodic token checks (every minute)
- Automatic logout when token expires

### 7. Protected Route Enhancement (`src/app/components/ProtectedRoute.tsx`)
- Checks token validity on component mount
- Redirects to login if token is expired
- Uses both Redux state and direct token validation

### 8. MainLayout Integration (`src/app/layouts/MainLayout.tsx`)
- Integrates token validation in the main layout
- Checks token before fetching data
- Ensures authenticated users have valid tokens

## How It Works

### On App Startup
1. `AuthInitializer.loadInitialState()` checks stored token validity
2. If token is expired, auth state is cleared
3. `AuthInterceptor.initialize()` sets up periodic checks

### On API Requests
1. Request interceptor checks token expiration before sending request
2. If expired, user is logged out and redirected to login
3. If 401 response received, same logout/redirect process

### Periodic Checks
1. Every 30 seconds: `AuthInterceptor` checks token validity
2. Every minute: `useTokenValidation` hook checks token validity
3. On page visibility change: Token is re-validated

### On Route Access
1. `ProtectedRoute` checks token validity on mount
2. If expired, redirects to login immediately
3. Preserves attempted URL for post-login redirect

## Benefits

1. **Immediate Response**: Users are redirected to login as soon as their token expires
2. **Multiple Layers**: Multiple checks ensure no expired tokens slip through
3. **Automatic Cleanup**: Expired tokens are automatically removed from storage
4. **Better UX**: Users don't see confusing permission errors or empty pages
5. **Security**: Ensures only users with valid tokens can access protected resources

## Testing

To test the JWT expiration handling:

1. **Login to the application**
2. **Wait for token to expire** (or manually expire it in browser dev tools)
3. **Try to access a protected route** - should redirect to login
4. **Try to make an API call** - should redirect to login
5. **Refresh the page** - should redirect to login if token is expired

## Configuration

The system is configurable through:
- Token check intervals in `AuthInterceptor` (currently 30 seconds)
- Token check intervals in `useTokenValidation` (currently 60 seconds)
- Expiration warning time in `isTokenExpiringSoon` (currently 5 minutes)

## Files Modified

- `src/utils/jwtUtils.ts` (new)
- `src/features/auth/core/AuthInitializer.ts`
- `src/features/auth/core/AuthInterceptor.ts` (new)
- `src/features/auth/hooks/useAuth.ts`
- `src/features/auth/hooks/useTokenValidation.ts` (new)
- `src/features/auth/api/authApi.ts`
- `src/app/axios.ts`
- `src/app/components/ProtectedRoute.tsx`
- `src/app/layouts/MainLayout.tsx`
- `src/app/ThemedApp.tsx`
- `src/features/syllabus/api/syllabusApi.ts` (new)

This comprehensive solution ensures that users are always redirected to login when their JWT tokens expire, providing a much better user experience and maintaining security. 