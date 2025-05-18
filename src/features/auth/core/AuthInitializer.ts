import { User } from './_models';

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
  }

  /**
   * Saves the auth token to localStorage
   */
  public static saveToken(token: string): void {
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
    return state.user?.token ?? null;
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
} 