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
}

export interface User {
    id: string;
    name: string;
    role: Role;
    avatar?: string;
}
