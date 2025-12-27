// Set global API base URL (without /api suffix)
window.API_BASE_URL =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : location.origin;

console.log("API_BASE_URL:", window.API_BASE_URL);

// For backward compatibility with existing api.js functions
const API_BASE_URL = `${window.API_BASE_URL}/api`;

function getAuthToken() {
    return localStorage.getItem('token');
}

function setAuthToken(token) {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

const authAPI = {
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    
    login: async (email, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    getMe: async () => {
        return apiRequest('/auth/me');
    }
};

const profileAPI = {
    update: async (data) => {
        return apiRequest('/profile', {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
};

const bookingsAPI = {
    create: async (bookingData) => {
        return apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    },
    
    getMy: async () => {
        return apiRequest('/bookings/me');
    },
    
    delete: async (id) => {
        return apiRequest(`/bookings/${id}`, {
            method: 'DELETE'
        });
    }
};

const contactsAPI = {
    create: async (contactData) => {
        return apiRequest('/contacts', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }
};

const servicesAPI = {
    getAll: async () => {
        return apiRequest('/services');
    },
    
    getById: async (id) => {
        return apiRequest(`/services/${id}`);
    }
};
