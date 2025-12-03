import type { Application, User } from '../types';

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Sales Officer 1', role: 'Sales' },
    { id: 'u2', name: 'ICR Officer 1', role: 'ICR' },
    { id: 'u3', name: 'Supervisor 1', role: 'Supervisor' },
    { id: 'u4', name: 'Credit Analyst 1', role: 'Analyst' },
    { id: 'u5', name: 'Approver 1', role: 'Approver' },
    { id: 'u6', name: 'Ops Officer 1', role: 'Operation' },
];

export const MOCK_APPLICATIONS: Application[] = [
    {
        id: 'APP-001',
        customerId: 'CUST-001',
        customerName: 'Budi Santoso',
        loanAmount: 50000000,
        tenor: 24,
        status: 'Draft',
        createdAt: '2023-10-25T10:00:00Z',
        updatedAt: '2023-10-25T10:00:00Z',
    },
    {
        id: 'APP-002',
        customerId: 'CUST-002',
        customerName: 'Siti Aminah',
        loanAmount: 150000000,
        tenor: 36,
        status: 'Internal Checking',
        createdAt: '2023-10-24T14:30:00Z',
        updatedAt: '2023-10-25T09:15:00Z',
    },
    {
        id: 'APP-003',
        customerId: 'CUST-003',
        customerName: 'Ahmad Rizki',
        loanAmount: 75000000,
        tenor: 12,
        status: 'Internal Checking',
        createdAt: '2023-10-20T11:20:00Z',
        updatedAt: '2023-10-24T16:45:00Z',
        assignedTo: 'Analyst',
    },
    {
        id: 'APP-004',
        customerId: 'CUST-004',
        customerName: 'Dewi Lestari',
        loanAmount: 200000000,
        tenor: 48,
        status: 'Approval',
        createdAt: '2023-10-18T09:00:00Z',
        updatedAt: '2023-10-23T13:30:00Z',
    },
    {
        id: 'APP-005',
        customerId: 'CUST-005',
        customerName: 'Eko Prasetyo',
        loanAmount: 30000000,
        tenor: 12,
        status: 'Disbursement Ready',
        createdAt: '2023-10-15T15:10:00Z',
        updatedAt: '2023-10-22T10:20:00Z',
    },
];
