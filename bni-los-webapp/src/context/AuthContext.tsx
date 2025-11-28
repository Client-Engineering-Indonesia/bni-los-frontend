import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role, User } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
    user: User | null;
    login: (role: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (role: Role) => {
        const mockUser = MOCK_USERS.find(u => u.role === role);
        if (mockUser) {
            setUser(mockUser);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
