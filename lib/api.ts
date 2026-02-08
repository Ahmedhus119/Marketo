import { API_BASE_URL, STORAGE_KEYS } from './constants';
import { ApiResponse, ErrorResponse } from '@/types/index';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const data = await response.json();

        if (!response.ok) {
            const error: ErrorResponse = {
                statusCode: response.status,
                message: data.message || 'An error occurred',
                errors: data.errors,
            };

            // If unauthorized, clear token and redirect to login
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    window.location.href = '/login';
                }
            }

            throw error;
        }

        return data as ApiResponse<T>;
    }

    private buildUrl(endpoint: string): string {
        return `${this.baseURL}${endpoint}`;
    }

    private buildHeaders(options?: RequestOptions): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options?.headers,
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async request<T>(
        endpoint: string,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options);

        const response = await fetch(url, {
            ...options,
            headers,
        });

        return this.handleResponse<T>(response);
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'GET',
        });
    }

    async post<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T>(
        endpoint: string,
        body?: unknown,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'DELETE',
        });
    }
}

// Create and export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to build endpoint URLs with parameters
export function buildEndpoint(template: string, params?: Record<string, string>): string {
    let endpoint = template;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            endpoint = endpoint.replace(`:${key}`, value);
        });
    }
    return endpoint;
}

// Helper function to build query string
export function buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(v => query.append(key, String(v)));
            } else {
                query.set(key, String(value));
            }
        }
    });
    return query.toString() ? `?${query.toString()}` : '';
}