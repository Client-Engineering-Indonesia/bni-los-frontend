/**
 * TypeScript types for Loan Application API payload
 * Matches the exact structure required by /loan/insert endpoint
 */

export interface LoanInformation {
    loanId: string;
    pksNumberCompany: string;
    creditProduct: string;
    salesId: string;
}

export interface CustomerInformation {
    fullName: string;
    nik: string;
    debtorOccupation: string;
    lengthOfEmployment: string;
    salary: number;
}

export interface EmergencyContact {
    contactName: string;
    phoneNumber: string;
    relationship: string;
}

export interface Documents {
    ktpDocumentId: string;
    ktpDocumentBase64: string;
    ktpDocumentFilename: string;
    npwpDocumentId: string;
    npwpDocumentBase64: string;
    npwpDocumentFilename: string;
}

export interface LoanDetails {
    loanAmount: number;
    tenor: number;
}

export interface BankingInformation {
    bankName: string;
    accountNumber: string;
    hasPayrollAccount: boolean;
    existingLoans: string;
}

export interface PreferredDisbursementAccount {
    recipientName: string;
    bankName: string;
    accountNumber: string;
}

export interface InternalCheckingResult {
    dhnResult: string;
    amlResult: string;
    centralDedupResult: string;
    pepFlag: boolean;
}

export interface LoanApplication {
    status: string;
    loanInformation: LoanInformation;
    customerInformation: CustomerInformation;
    emergencyContact: EmergencyContact;
    documents: Documents;
    loanDetails: LoanDetails;
    bankingInformation: BankingInformation;
    preferredDisbursementAccount: PreferredDisbursementAccount;
    internalCheckingResult: InternalCheckingResult;
}

export interface LoanApplicationPayload {
    loanApplication: LoanApplication;
}

export interface LoanApplicationResponse {
    status: {
        responseCode: string;
        responseMessage: string;
    };
    applicationId?: string;
}
