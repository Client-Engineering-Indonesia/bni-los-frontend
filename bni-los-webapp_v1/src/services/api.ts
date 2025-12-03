import type { WorklistAPIResponse } from '../types/api';
import type { Role } from '../types';
import type { LoanApplicationPayload, LoanApplicationResponse } from '../types/loanApplicationAPI';

// API Configuration
// Using proxy path /api which will be rewritten to https://nds-webmethod.ngrok.dev:443/restv2 by Vite
const API_BASE_URL = '/api/Fleksi.leads.controllers:LoanController';
const AUTH_CREDENTIALS = btoa('Administrator:manage'); // Base64 encode "Administrator:manage"

// Map roles to their API user parameter values
const ROLE_USER_MAPPING: Record<Role, string | null> = {
    'Sales': null, // Sales uses salesId, not user parameter
    'ICR': 'icr_user',
    'Supervisor': 'sales_spv',
    'Analyst': 'analyst_user',
    'Approver': 'approver_user',
    'Operation': 'operation_user',
    'Admin': null, // Admin doesn't call worklist API
};

/**
 * Fetch worklist data from the API based on user role
 * @param role - User role (Sales, ICR, Supervisor, etc.)
 * @param salesId - Sales ID (only for Sales role)
 * @param page - Page number (1-indexed)
 * @param size - Items per page
 */
export async function fetchWorklist(
    role: Role,
    salesId?: string,
    page: number = 1,
    size: number = 10
): Promise<WorklistAPIResponse> {

    let url: string;

    if (role === 'Sales') {
        // Sales role uses worklist-sales endpoint with salesId parameter
        const params = new URLSearchParams({
            salesId: salesId || '35246', // Default for testing
            page: page.toString(),
            size: size.toString(),
        });
        url = `${API_BASE_URL}/loan/worklist-sales?${params.toString()}`;
    } else {
        // Other roles use worklist endpoint with user parameter
        const userParam = ROLE_USER_MAPPING[role];
        if (!userParam) {
            throw new Error(`No user mapping found for role: ${role}`);
        }

        const params = new URLSearchParams({
            user: userParam,
            page: page.toString(),
            size: size.toString(),
        });
        url = `${API_BASE_URL}/loan/worklist?${params.toString()}`;
    }

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

/**
 * Submit a new loan application
 * @param payload - The loan application payload matching API requirements
 * @returns Promise with API response
 */
export async function submitLoanApplication(
    payload: LoanApplicationPayload
): Promise<LoanApplicationResponse> {
    const url = `${API_BASE_URL}/loan/insert`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please check credentials.');
            }
            if (response.status === 400) {
                throw new Error('Invalid application data. Please check all fields.');
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data: LoanApplicationResponse = await response.json();

        if (!data) {
            throw new Error('Received empty response from server');
        }

        // Check response code - handle both string and number
        const code = String(data?.responseCode);
        if (code !== '00' &&
            code !== '200' &&
            code.toUpperCase() !== 'SUCCESS') {
            throw new Error(data?.responseMessage || 'Failed to submit loan application');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while submitting the application.');
    }
}

/**
 * Terminate/Delete a loan application
 * @param piid - The Process Instance ID of the application to delete
 * @returns Promise with API response
 */
export async function terminateLoanApplication(piid: string): Promise<void> {
    const url = `${API_BASE_URL}/loan/terminate`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
            },
            body: JSON.stringify({ piid }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please check credentials.');
            }
            if (response.status === 404) {
                throw new Error('Application not found.');
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        // The API might return a JSON response even for void, but we just check for success
        // If needed we can parse it, but for now void is sufficient as per requirements
        // "After deletion, refresh the worklist" implies we just need to know it succeeded.

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while deleting the application.');
    }
}

/**
 * Reject a loan application
 * @param piid - Process Instance ID from the worklist
 * @returns Promise with API response
 */
export async function rejectLoanApplication(
    piid: string
): Promise<{ responseCode: string; responseMessage: string; result: string }> {
    const url = `${API_BASE_URL}/loan/reject`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
            },
            body: JSON.stringify({ piid }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please check credentials.');
            }
            if (response.status === 400) {
                throw new Error('Invalid request. Please check the PIID.');
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
            throw new Error('Received empty response from server');
        }

        // Check response code - API returns top-level responseCode
        const code = String(data?.responseCode);
        if (code !== '00' &&
            code !== '200' &&
            code.toUpperCase() !== 'SUCCESS') {
            throw new Error(data?.responseMessage || 'Failed to reject loan application');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while rejecting the application.');
    }
}

/**
 * Submit loan application process (e.g. Start Internal Check)
 * @param piid - Process Instance ID
 * @returns Promise with API response
 */
export async function submitLoanProcess(
    piid: string
): Promise<{ responseCode: string; responseMessage: string; result: string }> {
    const url = `${API_BASE_URL}/loan/submit`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${AUTH_CREDENTIALS}`,
            },
            body: JSON.stringify({ piid }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed. Please check credentials.');
            }
            if (response.status === 400) {
                throw new Error('Invalid request. Please check the PIID.');
            }
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
            throw new Error('Received empty response from server');
        }

        // Check response code
        const code = String(data?.responseCode);
        if (code !== '00' &&
            code !== '200' &&
            code.toUpperCase() !== 'SUCCESS') {
            throw new Error(data?.responseMessage || 'Failed to submit process');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while submitting the process.');
    }
}
