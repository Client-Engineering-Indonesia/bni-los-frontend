/**
 * TypeScript types for Loan Application API payload
 * Matches the exact structure required by /loan/insert endpoint
 */

import type { LoanApplicationDetails } from "./api";

export interface LoanInformation {
    loanId: string;
    pksNumberCompany?: string;
    creditProduct?: string;
    salesId?: string;
}

export interface CustomerInformation {
    fullName?: string;
    nik?: string;
    debtorOccupation?: string;
    lengthOfEmployment?: string;
    salary?: number;
}

export interface EmergencyContact {
    contactName?: string;
    phoneNumber?: string;
    relationship?: string;
}

export interface Documents {
    ktpDocumentId?: string;
    ktpDocumentBase64?: string;
    ktpDocumentFilename?: string;
    npwpDocumentId?: string;
    npwpDocumentBase64?: string;
    npwpDocumentFilename?: string;
}

export interface EDDDocuments {
    eddDocument1Base64?: string;
    eddDocument1Filename?: string;
    eddDocument1DocumentId?: string | null;
    eddDocument2Base64?: string;
    eddDocument2Filename?: string;
    eddDocument2DocumentId?: string | null;
}

export interface LoanDetails {
    loanAmount?: number;
    tenor?: number;
}

export interface BankingInformation {
    bankName?: string;
    accountNumber?: string;
    hasPayrollAccount?: boolean;
    existingLoans?: string;
}

export interface PreferredDisbursementAccount {
    recipientName?: string;
    bankName?: string;
    accountNumber?: string;
}

export interface InternalCheckingResult {
    dhnResult?: string;
    amlResult?: string;
    centralDedupResult?: string;
    pepFlag?: boolean;
}

export interface ExternalCheckingResult {
    npwpChecking?: string;
    dukcapilChecking?: string;
    slikChecking?: string;
}

export interface LimitCalculation {
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

export interface LoanApplication {
    status: string;
    loanId?: string; // Added for responses that have loanId at top level
    loanInformation?: LoanInformation;
    customerInformation?: CustomerInformation;
    emergencyContact?: EmergencyContact;
    documents?: Documents;
    eddDocuments?: EDDDocuments;
    loanDetails?: LoanDetails;
    bankingInformation?: BankingInformation;
    preferredDisbursementAccount?: PreferredDisbursementAccount;
    internalCheckingResult?: InternalCheckingResult;
    externalCheckingResult?: ExternalCheckingResult;
    limitCalculation?: LimitCalculation;
}

export interface LoanApplicationPayload {
    loanApplication: LoanApplication;
}

export interface LoanApplicationResponse {
    responseCode: string;
    responseMessage: string;
    piid?: string;
    loanId?: string;
}

export interface EDDUpdatePayload {
    piid: string;
    loanApplication: {
        loanId: string;
        status: string;
        loanInformation: LoanInformation;
        customerInformation: CustomerInformation;
        emergencyContact: EmergencyContact;
        documents: Documents;
        loanDetails: LoanDetails;
        bankingInformation: BankingInformation;
        preferredDisbursementAccount: PreferredDisbursementAccount;
        internalCheckingResult: InternalCheckingResult;
    };
}

export interface LoanRecalculationResponse {
    responseCode: string;
    responseMessage: string;
    piid?: string;
    loanApplication: LoanApplicationDetails
}
