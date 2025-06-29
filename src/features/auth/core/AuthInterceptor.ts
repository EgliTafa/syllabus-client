import { store } from '../../../app/store';
import { logout } from '../state/authSlice';
import { isTokenExpired } from '../../../utils/jwtUtils';
import { AuthInitializer } from './AuthInitializer';

export class AuthInterceptor {
  private static isInitialized = false;
  private static tokenCheckInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize the auth interceptor
   */
  public static initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Immediately check token validity on app startup
    this.checkTokenValidity();
    
    // Set up a periodic check for token expiration (every 30 seconds)
    this.setupTokenExpirationCheck();
    
    // Set up beforeunload event to check token on page refresh
    this.setupBeforeUnloadHandler();
    
    // Set up visibility change handler to check token when user returns to tab
    this.setupVisibilityChangeHandler();
    
    this.isInitialized = true;
  }

  /**
   * Check if the current token is valid and logout if expired
   */
  public static checkTokenValidity(): boolean {
    const state = store.getState();
    const token = state.auth.user?.token;

    if (!token) {
      // No token found, ensure user is logged out
      if (state.auth.isAuthenticated) {
        console.log('No token found but user marked as authenticated, logging out');
        this.handleLogout();
      }
      return false;
    }

    if (isTokenExpired(token)) {
      console.log('Token is expired, logging out user');
      this.handleLogout();
      return false;
    }

    // Validate against stored state
    if (!AuthInitializer.validateAuthState()) {
      console.log('Stored auth state is invalid, logging out user');
      this.handleLogout();
      return false;
    }

    return true;
  }

  /**
   * Handle logout process
   */
  private static handleLogout(): void {
    store.dispatch(logout());
    AuthInitializer.clearAuthState();
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Set up periodic token expiration check
   */
  private static setupTokenExpirationCheck(): void {
    // Clear any existing interval
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }

    // Check every 30 seconds
    this.tokenCheckInterval = setInterval(() => {
      this.checkTokenValidity();
    }, 30000);
  }

  /**
   * Set up beforeunload event handler
   */
  private static setupBeforeUnloadHandler(): void {
    const handleBeforeUnload = () => {
      // Store a timestamp when the page is about to unload
      sessionStorage.setItem('lastUnloadTime', Date.now().toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  /**
   * Set up visibility change handler
   */
  private static setupVisibilityChangeHandler(): void {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User has returned to the tab, check token validity
        const lastUnloadTime = sessionStorage.getItem('lastUnloadTime');
        if (lastUnloadTime) {
          const timeSinceUnload = Date.now() - parseInt(lastUnloadTime);
          // If more than 5 minutes have passed, check token validity
          if (timeSinceUnload > 5 * 60 * 1000) {
            console.log('User returned after 5+ minutes, checking token validity');
            this.checkTokenValidity();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  /**
   * Clean up the interceptor
   */
  public static cleanup(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
    this.isInitialized = false;
  }

  /**
   * Get the current token from the store
   */
  public static getCurrentToken(): string | null {
    const state = store.getState();
    const token = state.auth.user?.token;
    
    if (!token) {
      return null;
    }
    
    if (isTokenExpired(token)) {
      console.log('Current token is expired, clearing');
      this.handleLogout();
      return null;
    }
    
    return token;
  }

  /**
   * Check if user is authenticated
   */
  public static isAuthenticated(): boolean {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated && !!state.auth.user?.token;
    
    // Additional validation
    if (isAuthenticated && !AuthInitializer.validateAuthState()) {
      console.log('Authentication state is invalid, logging out');
      this.handleLogout();
      return false;
    }
    
    return isAuthenticated;
  }
} 