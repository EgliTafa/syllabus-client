export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  [key: string]: any;
}

/**
 * Decodes a JWT token and returns the payload
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Gets the expiration time of a JWT token
 */
export const getTokenExpirationTime = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  return new Date(decoded.exp * 1000);
};

/**
 * Gets the time until token expiration in milliseconds
 */
export const getTimeUntilExpiration = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, (decoded.exp - currentTime) * 1000);
};

/**
 * Checks if a token will expire within the specified time (in minutes)
 */
export const isTokenExpiringSoon = (token: string, minutes: number = 5): boolean => {
  const timeUntilExpiration = getTimeUntilExpiration(token);
  const minutesInMs = minutes * 60 * 1000;
  return timeUntilExpiration > 0 && timeUntilExpiration <= minutesInMs;
}; 