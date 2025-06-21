import { store } from '../../../app/store';
import { logout } from '../state/authSlice';
import { isTokenExpired } from '../../../utils/jwtUtils';

export class AuthInterceptor {
  private static isInitialized = false;

  /**
   * Initialize the auth interceptor
   */
  public static initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Set up a periodic check for token expiration
    this.setupTokenExpirationCheck();
    
    // Set up beforeunload event to check token on page refresh
    this.setupBeforeUnloadHandler();
    
    this.isInitialized = true;
  }

  /**
   * Check if the current token is valid and logout if expired
   */
  public static checkTokenValidity(): boolean {
    const state = store.getState();
    const token = state.auth.user?.token;

    if (token && isTokenExpired(token)) {
      console.log('Token is expired, logging out user');
      store.dispatch(logout());
      localStorage.removeItem('token');
      window.location.href = '/login';
      return false;
    }

    return true;
  }

  /**
   * Force logout the user
   */
  public static forceLogout(): void {
    console.log('Force logging out user');
    store.dispatch(logout());
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  /**
   * Set up periodic token expiration check
   */
  private static setupTokenExpirationCheck(): void {
    // Check every 30 seconds
    setInterval(() => {
      this.checkTokenValidity();
    }, 30000);

    // Also check when the page becomes visible (user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkTokenValidity();
      }
    });
  }

  /**
   * Set up beforeunload handler to check token on page refresh
   */
  private static setupBeforeUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      this.checkTokenValidity();
    });
  }

  /**
   * Get the current token from the store
   */
  public static getCurrentToken(): string | null {
    const state = store.getState();
    return state.auth.user?.token ?? null;
  }

  /**
   * Check if user is authenticated
   */
  public static isAuthenticated(): boolean {
    const state = store.getState();
    return state.auth.isAuthenticated && !!state.auth.user?.token;
  }
} 