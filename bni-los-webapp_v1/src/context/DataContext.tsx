import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Application, ApplicationStatus, PKSCompany } from '../types';
import type { PaginationState } from '../types/api';
import applicationsData from '../data/applications.json';
import pksCompaniesData from '../data/pksCompanies.json';
import optionsData from '../data/options.json';

interface DataContextType {
    applications: Application[];
    addApplication: (app: Application) => void;
    updateApplicationStatus: (id: string, status: ApplicationStatus, data?: any) => void;
    deleteApplication: (id: string) => void;
    getApplication: (id: string) => Application | undefined;
    pksCompanies: PKSCompany[];
    addPKSCompany: (company: PKSCompany) => void;
    options: typeof optionsData;
    // New API-related states
    isLoading: boolean;
    error: string | null;
    pagination: PaginationState;
    setApplications: (apps: Application[]) => void;
    setPagination: (pagination: PaginationState) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [applications, setApplications] = useState<Application[]>(applicationsData as Application[]);
    const [pksCompanies, setPKSCompanies] = useState<PKSCompany[]>(pksCompaniesData as PKSCompany[]);
    const [options] = useState(optionsData);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        size: 10,
        total: 0,
        totalPages: 0,
    });

    const addApplication = (app: Application) => {
        setApplications(prev => [app, ...prev]);
    };

    const updateApplicationStatus = (id: string, status: ApplicationStatus, data?: any) => {
        setApplications(prev => prev.map(app => {
            if (app.id === id) {
                return {
                    ...app,
                    status,
                    updatedAt: new Date().toISOString(),
                    ...data
                };
            }
            return app;
        }));
    };

    const deleteApplication = (id: string) => {
        setApplications(prev => prev.filter(app => app.id !== id));
    };

    const getApplication = (id: string) => {
        return applications.find(app => app.id === id);
    };

    const addPKSCompany = (company: PKSCompany) => {
        setPKSCompanies(prev => [...prev, company]);
    };

    return (
        <DataContext.Provider value={{
            applications,
            addApplication,
            updateApplicationStatus,
            deleteApplication,
            getApplication,
            pksCompanies,
            addPKSCompany,
            options,
            isLoading,
            error,
            pagination,
            setApplications,
            setPagination,
            setLoading,
            setError,
        }}>
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
