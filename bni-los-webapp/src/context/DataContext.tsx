import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Application, ApplicationStatus } from '../types';
import { MOCK_APPLICATIONS } from '../data/mockData';

interface DataContextType {
    applications: Application[];
    addApplication: (app: Application) => void;
    updateApplicationStatus: (id: string, status: ApplicationStatus, data?: any) => void;
    deleteApplication: (id: string) => void;
    getApplication: (id: string) => Application | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

    const addApplication = (app: Application) => {
        setApplications(prev => [app, ...prev]);
    };

    const updateApplicationStatus = (id: string, status: ApplicationStatus, data?: any) => {
        setApplications(prev => prev.map(app =>
            app.id === id ? { ...app, status, updatedAt: new Date().toISOString(), ...data } : app
        ));
    };

    const deleteApplication = (id: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
    };

    const getApplication = (id: string) => {
        return applications.find(app => app.id === id);
    };

    return (
        <DataContext.Provider value={{ applications, addApplication, updateApplicationStatus, deleteApplication, getApplication }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
