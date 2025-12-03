import type { Application } from '../types';
import type { WorklistItem } from '../types/api';

/**
 * Maps a WorklistItem from the API to the Application format used in the frontend
 */
export function mapWorklistToApplication(item: WorklistItem): Application {
    const { loanApplication } = item;

    // Safely get customer name from multiple possible locations
    const customerName = item.customerName ||
        loanApplication.customerInformation?.fullName ||
        'Unknown Customer';

    // Get salesId from item level or from loanInformation
    const salesId = item.salesId ||
        loanApplication.loanInformation?.salesId ||
        undefined;

    return {
        id: item.applicationId || loanApplication.loanId || item.piid,
        customerId: item.piid,
        customerName,
        nik: loanApplication.customerInformation?.nik || '',
        loanAmount: loanApplication.loanDetails?.loanAmount || 0,
        tenor: loanApplication.loanDetails?.tenor || 0,
        status: item.status as any,
        createdAt: item.date,
        updatedAt: item.date,
        salesId,
        piid: item.piid, // Add PIID for reject API
        loanId: loanApplication.loanInformation?.loanId || loanApplication.loanId,
        pksNumber: loanApplication.loanInformation?.pksNumberCompany || '',
        kreditProduct: loanApplication.loanInformation?.creditProduct || '',
        debtorOccupation: loanApplication.customerInformation?.debtorOccupation || '',
        eddNotes: loanApplication.eddNotes,
        bankingInfo: {
            bankName: loanApplication.bankingInformation?.bankName || '',
            accountNumber: loanApplication.bankingInformation?.accountNumber || '',
            payrollAccount: loanApplication.bankingInformation?.hasPayrollAccount || false,
            disbursementAccount: {
                recipientName: loanApplication.preferredDisbursementAccount?.recipientName || '',
                bankName: loanApplication.preferredDisbursementAccount?.bankName || '',
                accountNumber: loanApplication.preferredDisbursementAccount?.accountNumber || '',
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
