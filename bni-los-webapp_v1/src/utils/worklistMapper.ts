import type { Application } from '../types';
import type { WorklistItem } from '../types/api';

/**
 * Maps a WorklistItem from the API to the Application format used in the frontend
 */
export function mapWorklistToApplication(item: WorklistItem): Application {
    const { loanApplication } = item;

    return {
        id: item.applicationId,
        customerId: item.piid, // Using piid as customerId
        customerName: loanApplication.customerInformation.fullName,
        nik: loanApplication.customerInformation.nik,
        loanAmount: loanApplication.loanDetails.loanAmount,
        tenor: loanApplication.loanDetails.tenor,
        status: item.status as any, // API status might need mapping
        createdAt: item.date,
        updatedAt: item.date,
        salesId: item.salesId,
        loanId: loanApplication.loanInformation.loanId,
        pksNumber: loanApplication.loanInformation.pksNumberCompany,
        kreditProduct: loanApplication.loanInformation.creditProduct,
        debtorOccupation: loanApplication.customerInformation.debtorOccupation,
        eddNotes: loanApplication.eddNotes,
        bankingInfo: {
            bankName: loanApplication.bankingInformation.bankName,
            accountNumber: loanApplication.bankingInformation.accountNumber,
            payrollAccount: false, // Default, may need to be added to API
            disbursementAccount: {
                recipientName: loanApplication.preferredDisbursementAccount.recipientName,
                bankName: loanApplication.preferredDisbursementAccount.bankName,
                accountNumber: loanApplication.preferredDisbursementAccount.accountNumber,
            },
        },
    };
}

/**
 * Maps an array of WorklistItems to Applications
 */
export function mapWorklistsToApplications(items: WorklistItem[]): Application[] {
    return items.map(mapWorklistToApplication);
}
