// API configuration and utility functions
import type { CreateSalonDTO, UpdateSalonDTO } from '@/types/salon';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Generic API request function
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to get the error message from the response body
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // If we can't parse the response, use the default message
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: (userData: { name: string; email: string; password: string; role: string }) =>
    apiRequest('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string; role?: string }) =>
    apiRequest('/api/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiRequest('/api/users/logout', {
      method: 'POST',
    }),

  getProfile: () =>
    apiRequest('/api/auth/me', {
      method: 'GET',
    }),
};

// Salon API calls
export const salonAPI = {
  create: (salonData: CreateSalonDTO) =>
    apiRequest('/api/salons', {
      method: 'POST',
      body: JSON.stringify(salonData),
    }),

  getAll: (params?: { city?: string }) => {
    const queryParams = params?.city ? `?city=${encodeURIComponent(params.city)}` : '';
    return apiRequest(`/api/salons${queryParams}`, {
      method: 'GET',
    });
  },

  getById: (id: string) =>
    apiRequest(`/api/salons/${id}`, {
      method: 'GET',
    }),

  update: (id: string, salonData: UpdateSalonDTO) =>
    apiRequest(`/api/salons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(salonData),
    }),

  delete: (id: string) =>
    apiRequest(`/api/salons/${id}`, {
      method: 'DELETE',
    }),

  getOwnerSalons: () =>
    apiRequest('/api/salons/owner/my-salons', {
      method: 'GET',
    }),
};

// Booking API calls
export const bookingAPI = {
  create: (bookingData: {
    salonId: string;
    services: string[];
    date: string;
    time: string;
    notes?: string;
    totalAmount?: number;
  }) =>
    apiRequest('/api/bookings/create', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getMyBookings: () =>
    apiRequest('/api/bookings/my-bookings', {
      method: 'GET',
    }),

  getSalonBookings: (salonId: string) =>
    apiRequest(`/api/bookings/salon/${salonId}`, {
      method: 'GET',
    }),

  getById: (id: string) =>
    apiRequest(`/api/bookings/${id}`, {
      method: 'GET',
    }),

  updateStatus: (id: string, status: string, cancellationReason?: string) =>
    apiRequest(`/api/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, cancellationReason }),
    }),

  cancel: (id: string, cancellationReason?: string) =>
    apiRequest(`/api/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellationReason }),
    }),
};

export { API_URL };
