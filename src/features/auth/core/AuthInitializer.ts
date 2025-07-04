import { User } from './_models';
import { isTokenExpired } from '../../../utils/jwtUtils';

export class AuthInitializer {
  private static readonly AUTH_STATE_KEY = 'authState';

  /**
   * Loads the initial auth state from localStorage
   */
  public static loadInitialState(): {
    user: User | null;
    isAuthenticated: boolean;
    isFetching: boolean;
    error: string | null;
  } {
    try {
      const serializedState = localStorage.getItem(this.AUTH_STATE_KEY);
      if (!serializedState) {
        return this.getDefaultState();
      }

      const state = JSON.parse(serializedState);
      
      // Validate the stored state has required fields
      if (!this.isValidAuthState(state)) {
        console.log('Invalid auth state found, clearing and returning default');
        this.clearAuthState();
        return this.getDefaultState();
      }

      // Check if user has a valid token
      if (state.user?.token) {
        if (isTokenExpired(state.user.token)) {
          console.log('Stored token is expired, clearing auth state');
          this.clearAuthState();
          return this.getDefaultState();
        }
        
        // Additional validation: ensure user object has required fields
        if (!this.isValidUser(state.user)) {
          console.log('Invalid user object found, clearing auth state');
          this.clearAuthState();
          return this.getDefaultState();
        }
      } else if (state.isAuthenticated) {
        // If marked as authenticated but no token, clear the state
        console.log('No token found but marked as authenticated, clearing auth state');
        this.clearAuthState();
        return this.getDefaultState();
      }

      return state;
    } catch (error) {
      console.error('Error loading auth state:', error);
      this.clearAuthState();
      return this.getDefaultState();
    }
  }

  /**
   * Saves the auth state to localStorage
   */
  public static saveAuthState(state: {
    user: User | null;
    isAuthenticated: boolean;
    isFetching: boolean;
    error: string | null;
  }): void {
    try {
      // Validate state before saving
      if (state.isAuthenticated && (!state.user || !state.user.token)) {
        console.warn('Attempting to save authenticated state without valid user/token');
        return;
      }
      
      localStorage.setItem(this.AUTH_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }

  /**
   * Clears all auth-related data from localStorage
   */
  public static clearAuthState(): void {
    localStorage.removeItem(this.AUTH_STATE_KEY);
    localStorage.removeItem('token'); // Also clear the legacy token storage
    sessionStorage.removeItem('token'); // Clear session storage as well
  }

  /**
   * Saves the auth token to localStorage
   */
  public static saveToken(token: string): void {
    if (!token || isTokenExpired(token)) {
      console.warn('Attempting to save invalid or expired token');
      return;
    }
    
    const state = this.loadInitialState();
    if (state.user) {
      state.user.token = token;
      this.saveAuthState(state);
    }
  }

  /**
   * Gets the stored auth token
   */
  public static getToken(): string | null {
    const state = this.loadInitialState();
    const token = state.user?.token;
    
    if (!token) {
      return null;
    }
    
    if (isTokenExpired(token)) {
      console.log('Retrieved token is expired, clearing auth state');
      this.clearAuthState();
      return null;
    }
    
    return token;
  }

  /**
   * Checks if the stored token is valid
   */
  public static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !isTokenExpired(token);
  }

  /**
   * Validates the current authentication state
   */
  public static validateAuthState(): boolean {
    const state = this.loadInitialState();
    
    if (!state.isAuthenticated) {
      return false;
    }
    
    if (!state.user || !state.user.token) {
      console.log('User marked as authenticated but no valid user/token found');
      this.clearAuthState();
      return false;
    }
    
    if (isTokenExpired(state.user.token)) {
      console.log('Token is expired, clearing auth state');
      this.clearAuthState();
      return false;
    }
    
    return true;
  }

  /**
   * Returns the default auth state
   */
  private static getDefaultState(): {
    user: User | null;
    isAuthenticated: boolean;
    isFetching: boolean;
    error: string | null;
  } {
    return {
      user: null,
      isAuthenticated: false,
      isFetching: false,
      error: null,
    };
  }

  /**
   * Validates that the stored state has all required fields
   */
  private static isValidAuthState(state: any): boolean {
    return (
      state &&
      typeof state === 'object' &&
      'user' in state &&
      'isAuthenticated' in state &&
      'isFetching' in state &&
      'error' in state
    );
  }

  /**
   * Validates that the user object has required fields
   */
  private static isValidUser(user: any): boolean {
    return (
      user &&
      typeof user === 'object' &&
      'id' in user &&
      'email' in user &&
      'token' in user &&
      typeof user.token === 'string' &&
      user.token.length > 0
    );
  }
} 