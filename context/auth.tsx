'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUser, getAuthToken, logout } from '@/lib/auth';

interface AuthContextType {
    user: any | null;
    isAuthenticated: boolean;
    login: (email: string, name: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check if user is already logged in
        const savedUser = getUser();
        const token = getAuthToken();

        if (savedUser && token) {
            setUser(savedUser);
            setIsAuthenticated(true);
        }

        setMounted(true);
    }, []);

    const login = (email: string, name: string) => {
        const newUser = { email, name, id: 'user_' + Math.random().toString(36).substr(2, 9) };
        setUser(newUser);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}