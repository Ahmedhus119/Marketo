import { STORAGE_KEYS, AUTH_ENDPOINTS } from './constants';
import { apiClient, buildEndpoint } from './api';
import {
    User,
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    ChangePasswordPayload,
    ResetPasswordPayload,
} from '@/types/index';

/**
 * Save authentication token to localStorage
 */
export function setAuthToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return getAuthToken() !== null;
}

/**
 * Save user data to localStorage
 */
export function setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

/**
 * Get user data from localStorage
 */
export function getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
}

/**
 * Remove user data from localStorage
 */
export function removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Clear all authentication data
 */
export function clearAuth(): void {
    removeAuthToken();
    removeUser();
}

/**
 * Register a new user
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, payload);
    if (response.data) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        return response.data;
    }
    throw new Error('Registration failed');
}

/**
 * Login user
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, payload);
    if (response.data) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        return response.data;
    }
    throw new Error('Login failed');
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
    try {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
        clearAuth();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
    const response = await apiClient.get(AUTH_ENDPOINTS.GET_PROFILE);
    if (response.data) {
        setUser(response.data as User);
        return response.data as User;
    }
    throw new Error('Failed to fetch profile');
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE, data);
    if (response.data) {
        setUser(response.data as User);
        return response.data as User;
    }
    throw new Error('Failed to update profile');
}

/**
 * Request password reset (forgot password)
 */
export async function forgotPassword(email: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
}

/**
 * Reset password with reset token
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
}

/**
 * Change password (for authenticated users)
 */
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload);
}

/**
 * Validate authentication token
 */
export async function validateToken(): Promise<boolean> {
    try {
        const user = await getProfile();
        return !!user;
    } catch {
        clearAuth();
        return false;
    }
}

/**
 * Initialize auth from localStorage on app load
 */
export function initializeAuth(): User | null {
    const user = getUser();
    const token = getAuthToken();

    // If we have both user and token, assume authenticated
    if (user && token) {
        return user;
    }

    // Clear invalid state
    if (user || token) {
        clearAuth();
    }

    return null;
}