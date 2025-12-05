import { useState, useEffect, useCallback } from 'react';
import { fetchWorklist } from '../services/api';
import { mapWorklistsToApplications } from '../utils/worklistMapper';
import type { Application, Role } from '../types';
import type { PaginationState } from '../types/api';

interface UseWorklistResult {
    applications: Application[];
    pagination: PaginationState;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
    setPage: (page: number) => void;
}

/**
 * Custom hook to fetch and manage worklist data from the API
 * @param role - User role (Sales, ICR, Supervisor, etc.)
 * @param salesId - Optional sales ID (only for Sales role)
 * @param initialPage - Initial page number (default: 1)
 * @param initialSize - Initial page size (default: 10)
 */
export function useWorklist(
    role: Role,
    salesId?: string,
    initialPage: number = 1,
    initialSize: number = 10
): UseWorklistResult {
    const [applications, setApplications] = useState<Application[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        page: initialPage,
        size: initialSize,
        total: 0,
        totalPages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize] = useState(initialSize);

    const loadWorklist = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchWorklist(role, salesId, currentPage, pageSize);

            // Accept '00', '200', and 'SUCCESS' as valid response codes
            const validCodes = ['00', '200', 'SUCCESS'];
            const responseCode = response.status.responseCode;
            const isValid = validCodes.includes(responseCode) ||
                responseCode.toUpperCase() === 'SUCCESS';

            if (!isValid) {
                throw new Error(response.status.responseMessage || 'Failed to fetch worklist');
            }

            const mappedApplications = mapWorklistsToApplications(response.worklists);

            // Sort by submission date (newest first)
            const sortedApplications = mappedApplications.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Descending order (newest first)
            });

            setApplications(sortedApplications);
            setPagination(response.status.pagination);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            setApplications([]);
        } finally {
            setIsLoading(false);
        }
    }, [salesId, currentPage, pageSize]);

    // Load worklist on mount and when dependencies change
    useEffect(() => {
        loadWorklist();
    }, [loadWorklist, role]);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    return {
        applications,
        pagination,
        isLoading,
        error,
        refetch: loadWorklist,
        setPage,
    };
}
