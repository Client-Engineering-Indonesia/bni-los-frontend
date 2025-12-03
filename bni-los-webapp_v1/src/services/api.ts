import type { WorklistAPIResponse } from '../types/api';

// API Configuration
// Using proxy path /api which will be rewritten to https://nds-webmethod.ngrok.dev:443/restv2 by Vite
const API_BASE_URL = '/api/Fleksi.leads.controllers:LoanController';
const AUTH_CREDENTIALS = btoa('Administrator:manage'); // Base64 encode "Administrator:manage"

/**
 * Fetch worklist data from the API
 * @param salesId - Optional sales ID to filter worklist (required for Sales role)
 * @param page - Page number (1-indexed)
 * @param size - Items per page
 */
export async function fetchWorklist(
    salesId?: string,
    page: number = 1,
    size: number = 10
): Promise<WorklistAPIResponse> {
    // Build query parameters
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    // Add salesId only if provided (for Sales role)
    if (salesId) {
        params.append('salesId', salesId);
    }

    const url = `${API_BASE_URL}/loan/worklist-sales?${params.toString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json', // Force JSON response instead of HTML
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please check credentials.');
            }
            if (response.status === 404) {
                throw new Error('Worklist not found.');
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: WorklistAPIResponse = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while fetching worklist data.');
    }
}
