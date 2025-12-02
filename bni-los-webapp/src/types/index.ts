export type Role = 'Sales' | 'ICR' | 'Supervisor' | 'Analyst' | 'Approver' | 'Operation' | 'Admin';

export type ApplicationStatus =
    | 'Draft'
    | 'Submitted'
    | 'Internal Checking'
    | 'External Checking'
    | 'EDD Required'
    | 'Supervisor Review'
    | 'Analyst Review'
    | 'Approval'
    | 'Approved'
    | 'Rejected'
    | 'Disbursement Ready'
    | 'Disbursed';

export interface Customer {
    id: string;
    name: string;
    nik: string;
    phone: string;
    email: string;
    address: string;
    income: number;
}

export interface PKSCompany {
    id: string;
    pksNumber: string;
    companyName: string;
    companyOwnership?: string;
    groupInstitution?: string;
    companyType?: string;
    collaborationScheme?: string;
    companyStatus?: string;
    companyAddress?: string;
    pksCooperationType?: string;
    pksStatus?: string;
    pksExpiryDate?: string;
    createdAt: string;
}

export interface Application {
    id: string;
    customerId: string;
    customerName: string;
    loanAmount: number;
    tenor: number; // months
    status: ApplicationStatus;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string; // Role or User ID
    notes?: string[];
    salesId?: string;
    nik?: string;
    eddNotes?: string;
    approverChecklist?: {
        creditScoreChecked: boolean;
        documentsVerified: boolean;
        collateralValuation: boolean;
        complianceCheck: boolean;
    };
    disbursementDetails?: {
        accountNumber: string;
        bankName: string;
        amount: number;
        date: string;
        notes?: string;
    };
    nationalIdFile?: string; // URL or filename
    // New fields
    loanId?: string;
    pksNumber?: string;
    pksCompanyName?: string;
    kreditProduct?: string; // BNI Fleksi or others
    npwpFile?: string;
    debtorOccupation?: string;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    bankingInfo?: {
        bankName: string;
        accountNumber: string;
        payrollAccount: boolean;
        payrollAccountNumber?: string;
        existingLoans?: string;
        disbursementAccount?: {
            recipientName: string;
            bankName: string;
            accountNumber: string;
        };
    };
    income?: number;
    yearsOfService?: number;
}

export interface User {
    id: string;
    name: string;
    role: Role;
    avatar?: string;
}
