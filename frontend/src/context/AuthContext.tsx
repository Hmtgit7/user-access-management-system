// frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService, { User } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string, email: string, fullName: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => { },
    signup: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        const checkAuthState = async () => {
            setIsLoading(true);
            const storedUser = AuthService.getUserFromStorage();
            if (storedUser && AuthService.isAuthenticated()) {
                try {
                    // Verify token validity by fetching current user
                    const currentUser = await AuthService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    // If token is invalid, clear storage
                    AuthService.logout();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        checkAuthState();
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await AuthService.login({ username, password });
            AuthService.saveUserData(response.token, response.user);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (username: string, password: string, email: string, fullName: string) => {
        setIsLoading(true);
        try {
            const response = await AuthService.signup({ username, password, email, fullName });
            AuthService.saveUserData(response.token, response.user);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};