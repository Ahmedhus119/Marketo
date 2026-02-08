// Simple auth utilities - no complex API calls
// Just use localStorage for auth state

export const setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
};

export const setUser = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
    localStorage.removeItem('user');
};

export const logout = () => {
    removeAuthToken();
    removeUser();
};