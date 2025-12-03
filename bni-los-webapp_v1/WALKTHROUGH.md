# BNI LOS Webapp Walkthrough

## Overview
The BNI LOS Webapp has been successfully built using Vite, React, TypeScript, and Tailwind CSS. It simulates the end-to-end loan origination flow with role-based access control.

## Features Implemented

### 1. Role-Based Authentication
- **Login Page**: Allows selecting from multiple roles (Sales, ICR, Supervisor, Analyst, Approver, Operation).
- **Context**: `AuthContext` manages the current user session.

### 2. Dashboard
- **Dynamic Worklist**: Shows applications relevant to the logged-in user's role.
- **Statistics**: Quick view of total applications, pending actions, and completed loans.
- **Status Badges**: Color-coded badges for different application states.

### 3. Loan Origination Flow
- **New Application**: Sales officers can initiate new loan applications.
- **State Transitions**: Applications move through the following states:
    1.  **Draft** -> **Submitted** (Sales)
    2.  **Submitted** -> **Internal Checking** (Supervisor)
    3.  **Internal Checking** -> **External Checking** (ICR)
    4.  **External Checking** -> **Verification** (ICR)
    5.  **Verification** -> **Approval** (Analyst)
    6.  **Approval** -> **Disbursement Ready** (Approver)
    7.  **Disbursement Ready** -> **Disbursed** (Operation)

### 4. Application Detail
- **Detailed View**: Shows customer info and loan details.
- **Action Buttons**: Context-aware buttons based on the user's role and application status (e.g., "Approve", "Reject", "Request EDD").

## Demo Script (End-to-End Flow)

Follow these steps to demonstrate the full lifecycle of a loan application:

### Step 1: Sales Initiation
1.  **Login** as **Sales Officer 1**.
2.  Click **New Application** in the sidebar.
3.  Fill in the dummy customer data (Name, NIK, Phone, Amount, Tenor).
4.  Click **Submit Application**.
5.  *Result*: Application created with status **Submitted**.
6.  **Logout** (bottom left).

### Step 2: Supervisor Review
1.  **Login** as **Supervisor 1**.
2.  You will see the new application in your Worklist (Status: **Submitted**).
3.  Click **View Details**.
4.  Click **Approve Submission**.
5.  *Result*: Status changes to **Internal Checking**.
6.  **Logout**.

### Step 3: Internal & External Checks (ICR)
1.  **Login** as **ICR Officer 1**.
2.  Find the application (Status: **Internal Checking**).
3.  Click **View Details** -> **Approve Internal Check**.
4.  *Result*: Status changes to **External Checking**.
5.  Click **Approve External Check**.
6.  *Result*: Status changes to **Verification**.
7.  **Logout**.

### Step 4: Analysis & Verification
1.  **Login** as **Credit Analyst 1**.
2.  Find the application (Status: **Verification**).
3.  Click **View Details** -> **Submit for Approval**.
4.  *Result*: Status changes to **Approval**.
5.  **Logout**.

### Step 5: Final Approval
1.  **Login** as **Approver 1**.
2.  Find the application (Status: **Approval**).
3.  Click **View Details** -> **Final Approval**.
4.  *Result*: Status changes to **Disbursement Ready**.
5.  **Logout**.

### Step 6: Disbursement
1.  **Login** as **Ops Officer 1**.
2.  Find the application (Status: **Disbursement Ready**).
3.  Click **View Details** -> **Disburse Funds**.
4.  Fill in the **Disbursement Details** form (Bank Name, Account Number, Amount, Date).
5.  Click **Confirm Disbursement**.
6.  *Result*: Status changes to **Disbursed**.
7.  **Logout**.

## Verification
- **Build**: The project builds successfully with `npm run build`.
- **Type Safety**: TypeScript errors have been resolved.
- **Styling**: Tailwind CSS v4 is configured and working.
