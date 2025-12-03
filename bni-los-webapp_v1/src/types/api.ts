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
    applicationId: string;
    salesId: string;
    customerName: string;
    status: string;
    date: string;
    piid: string;
    loanApplication: LoanApplicationDetails;
}

export interface LoanApplicationDetails {
    loanInformation: {
        loanId: string;
        pksNumberCompany: string;
        creditProduct: string;
    };
    customerInformation: {
        fullName: string;
        nik: string;
        debtorOccupation: string;
    };
    loanDetails: {
        loanAmount: number;
        tenor: number;
    };
    bankingInformation: {
        bankName: string;
        accountNumber: string;
    };
    preferredDisbursementAccount: {
        recipientName: string;
        bankName: string;
        accountNumber: string;
    };
    status: string;
    eddNotes?: string;
}

// Pagination state
export interface PaginationState {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}
