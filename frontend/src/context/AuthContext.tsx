'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string, isAdmin?: boolean) => Promise<void>;
    signup: (name: string, email: string, pass: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('caffaine_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string, isAdmin: boolean = false) => {
        const res = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await res.json();
        const loggedUser = data.user;

        if (isAdmin && loggedUser.role !== 'ADMIN') {
            throw new Error('Access denied. Administrator privileges required.');
        }

        setUser(loggedUser);
        localStorage.setItem('caffaine_user', JSON.stringify(loggedUser));
        localStorage.setItem('caffaine_token', data.accessToken);
    };

    const signup = async (name: string, email: string, pass: string) => {
        const res = await fetch('http://localhost:3001/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data = await res.json();
        const loggedUser = data.user;

        setUser(loggedUser);
        localStorage.setItem('caffaine_user', JSON.stringify(loggedUser));
        localStorage.setItem('caffaine_token', data.accessToken);
    };

    const logout = () => {

        setUser(null);
        localStorage.removeItem('caffaine_user');
        localStorage.removeItem('caffaine_token');
    };

    const isAuthenticated = !!user;
    const isUserAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            isAuthenticated,
            isAdmin: isUserAdmin,
            loading
        }}>

            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
