/**
 * Authenticated API fetch utility.
 * Automatically attaches the admin JWT token to every request.
 */
const API_BASE = process.env.REACT_APP_BACKEND_URL;

export const apiFetch = (path, options = {}) => {
    const token = localStorage.getItem('adminToken');
    return fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
};

export default apiFetch;
