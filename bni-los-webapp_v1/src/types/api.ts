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
    emergencyContact?: {
        contactName?: string;
        phoneNumber?: string;
        relationship?: string;
    };
    documents?: {
        ktpDocumentId?: string;
        ktpDocumentBase64?: string;
        ktpDocumentFilename?: string;
        npwpDocumentId?: string;
        npwpDocumentBase64?: string;
        npwpDocumentFilename?: string;
        pkBase64?: string;
        skkBase64?: string;
    };
    eddDocuments?: {
        eddDocument1Base64?: string;
        eddDocument1Filename?: string;
        eddDocument1DocumentId?: string | null;
        eddDocument2Base64?: string;
        eddDocument2Filename?: string;
        eddDocument2DocumentId?: string | null;
    };
    loanDetails?: {
        loanAmount?: number;
        tenor?: number;
    };
    bankingInformation?: {
        bankName?: string;
        accountNumber?: string;
        hasPayrollAccount?: boolean;
        payrollAccountNumber?: string;
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
    limitCalculation: {
        tenor?: string;
        creditLimit?: string;
        tipeCredit?: string;
        interestRate?: string;
        penaltyFee?: string;
        provisionFee?: string;
        administrationFee?: string;
        psjtAdministrationFee?: string;
        DSR?: string;
        installment?: number;
        creditScore?: string;
    }
}

// Pagination state
export interface PaginationState {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}
