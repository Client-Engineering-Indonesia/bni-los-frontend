import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role, User } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
    user: User | null;
    login: (role: Role) => void;
    logout: () => void;
    switchRole: (role: Role) => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [baseRole, setBaseRole] = useState<Role | null>(null);

    const login = (role: Role) => {
        setBaseRole(role);
        const mockUser = MOCK_USERS.find(u => u.role === role);
        if (mockUser) {
            setUser(mockUser);
        }
    };

    const switchRole = (role: Role) => {
        const mockUser = MOCK_USERS.find(u => u.role === role);
        if (mockUser) {
            setUser(mockUser);
        }
    };

    const logout = () => {
        setUser(null);
        setBaseRole(null);
    };

    const isAdmin = baseRole === 'Admin';

    return (
        <AuthContext.Provider value={{ user, login, logout, switchRole, isAdmin }}>
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
