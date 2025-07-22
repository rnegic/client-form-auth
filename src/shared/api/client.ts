import type { User, CreateUserRequest, CreateUserPayload, UpdateUserRequest, UpdateUserPayload, LoginRequest, AuthResponse } from '@/shared/types';

const API_BASE_URL = '/api/v1';

class ApiClient {
    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('token');

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options?.headers,
            },
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
                console.error('API Error:', errorData);
            } catch (e) {
                console.error('Failed to parse error response');
            }
            throw new Error(errorMessage);
        }

        return response.json();
    }

    // Auth API
    async login(data: LoginRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async logout(): Promise<void> {
        return this.request<void>('/auth/logout', {
            method: 'POST',
        });
    }

    async getMe(): Promise<User> {
        return this.request<User>('/auth/me');
    }

    // Users API
    async getUsers(): Promise<User[]> {
        return this.request<User[]>('/users');
    }

    async getUserById(id: string | number): Promise<User> {
        return this.request<User>(`/users/${id}`);
    }

    async createUser(data: CreateUserRequest): Promise<User> {
        const payload: CreateUserPayload = {
            email: data.email,
            password: data.password,
            name: data.firstName,
            surName: data.lastName,
            fullName: data.fullName,
            employment: '',
            userAgreement: true,
        };
        console.log('Creating user with payload:', payload);
        return this.request<User>('/users', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async updateUser(id: string | number, data: UpdateUserRequest): Promise<User> {
        const payload: UpdateUserPayload = {
            name: data.firstName,
            surName: data.lastName,
            fullName: data.fullName,
            employment: '',
        };
        console.log('Updating user with payload:', payload);
        return this.request<User>(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
    }

    async deleteUser(id: string | number): Promise<void> {
        return this.request<void>(`/users/${id}`, {
            method: 'DELETE',
        });
    }
}

export const apiClient = new ApiClient();
