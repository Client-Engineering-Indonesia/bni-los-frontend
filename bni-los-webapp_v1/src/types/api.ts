// API Types based on the backend response structure
export interface WorklistAPIResponse {
    status: {
        responseCode: string;
        responseMessage: string;
        pagination: {
            page: number;
            size: number;
            total: number;
            totalPages: number;
        };
    };
    worklists: WorklistItem[];
}

export interface WorklistItem {
    applicationId?: string;
    salesId?: string;
    customerName?: string;
    status: string;
    date: string;
    piid: string;
    loanApplication: LoanApplicationDetails;
}

export interface LoanApplicationDetails {
    loanInformation: {
        loanId: string;
        pksNumberCompany?: string;
        creditProduct?: string;
        salesId?: string;
    };
    customerInformation?: {
        fullName?: string;
        nik?: string;
        debtorOccupation?: string;
        lengthOfEmployment?: string;
        salary?: number;
    };
    loanDetails?: {
        loanAmount?: number;
        tenor?: number;
    };
    bankingInformation?: {
        bankName?: string;
        accountNumber?: string;
        hasPayrollAccount?: boolean;
        existingLoans?: string;
    };
    preferredDisbursementAccount?: {
        recipientName?: string;
        bankName?: string;
        accountNumber?: string;
    };
    loanId: string;
    status: string;
    eddNotes?: string;
    internalCheckingResult?: {
        dhnResult?: string;
        amlResult?: string;
        centralDedupResult?: string;
        pepFlag?: boolean;
    };
    externalCheckingResult?: {
        npwpChecking?: string;
        dukcapilChecking?: string;
        slikChecking?: string;
    };
}

// Pagination state
export interface PaginationState {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}
