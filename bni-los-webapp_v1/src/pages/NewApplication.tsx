import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MoneyInput } from '../components/MoneyInput';
import { submitLoanApplication } from '../services/api';
import { convertFileToBase64 } from '../utils/fileUtils';
import { SuccessModal } from '../components/SuccessModal';
import type { LoanApplicationPayload } from '../types/loanApplicationAPI';

export const NewApplication = () => {
    const navigate = useNavigate();
    const { pksCompanies, options } = useData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [successTitle, setSuccessTitle] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [amount, setAmount] = useState(0);
    const [income, setIncome] = useState(0);
    const [selectedPKS, setSelectedPKS] = useState('');
    const [payrollAccount, setPayrollAccount] = useState(false);

    // State for "Others" inputs
    const [selectedProduct, setSelectedProduct] = useState('');
    const [otherProduct, setOtherProduct] = useState('');

    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [otherOccupation, setOtherOccupation] = useState('');

    const [selectedRelationship, setSelectedRelationship] = useState('');
    const [otherRelationship, setOtherRelationship] = useState('');

    const [selectedBank, setSelectedBank] = useState('');
    const [otherBank, setOtherBank] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.currentTarget;

        try {
            // Get all form inputs
            const getInputValue = (name: string) => {
                const element = form.elements.namedItem(name);
                return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
                    ? element.value
                    : element instanceof HTMLSelectElement
                        ? element.value
                        : '';
            };

            const fileInput = form.elements.namedItem('nationalIdFile') as HTMLInputElement;
            const npwpInput = form.elements.namedItem('npwpFile') as HTMLInputElement;
            const tenorInput = form.elements.namedItem('tenor') as HTMLSelectElement;

            // Convert files to Base64
            let ktpBase64 = '';
            let ktpFilename = '';
            if (fileInput?.files?.[0]) {
                ktpBase64 = await convertFileToBase64(fileInput.files[0]);
                ktpFilename = fileInput.files[0].name;
            }

            let npwpBase64 = '';
            let npwpFilename = '';
            if (npwpInput?.files?.[0]) {
                npwpBase64 = await convertFileToBase64(npwpInput.files[0]);
                npwpFilename = npwpInput.files[0].name;
            }

            const pksNumberCompany = selectedPKS;

            // Generate loan ID
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const loanId = `LN-${year}${month}${day}-${randomNum}`;

            // Build the complete payload
            const payload: LoanApplicationPayload = {
                loanApplication: {
                    status: 'PENDING',
                    loanInformation: {
                        loanId,
                        pksNumberCompany,
                        creditProduct: selectedProduct === 'Other' ? otherProduct : selectedProduct,
                        salesId: getInputValue('salesId'),
                    },
                    customerInformation: {
                        fullName: getInputValue('name'),
                        nik: getInputValue('nik'),
                        debtorOccupation: selectedOccupation === 'Lainnya' ? otherOccupation : selectedOccupation,
                        lengthOfEmployment: `${getInputValue('yearsOfService')} years`,
                        salary: income,
                    },
                    emergencyContact: {
                        contactName: getInputValue('emergencyName'),
                        phoneNumber: getInputValue('emergencyPhone'),
                        relationship: selectedRelationship === 'Others' ? otherRelationship : selectedRelationship,
                    },
                    documents: {
                        ktpDocumentId: '',
                        ktpDocumentBase64: ktpBase64,
                        ktpDocumentFilename: ktpFilename,
                        npwpDocumentId: '',
                        npwpDocumentBase64: npwpBase64,
                        npwpDocumentFilename: npwpFilename,
                    },
                    loanDetails: {
                        loanAmount: amount,
                        tenor: parseInt(tenorInput.value, 10),
                    },
                    bankingInformation: {
                        bankName: selectedBank === 'Lainnya' ? otherBank : selectedBank,
                        accountNumber: getInputValue('accountNumber'),
                        hasPayrollAccount: payrollAccount,
                        existingLoans: getInputValue('existingLoans'),
                    },
                    preferredDisbursementAccount: {
                        recipientName: getInputValue('disbursementRecipientName'),
                        bankName: getInputValue('disbursementBankName'),
                        accountNumber: getInputValue('disbursementAccountNumber'),
                    },
                    internalCheckingResult: {
                        dhnResult: 'CLEAR',
                        amlResult: 'LOW_RISK',
                        centralDedupResult: '',
                        pepFlag: false,
                    },
                },
            };

            // Submit to API
            const response = await submitLoanApplication(payload);
            console.log('Application submitted successfully:', response);

            // Success - show modal
            setLoading(false);
            setSuccessTitle('Submission Successful');
            setSuccessMessage(response.responseMessage || 'Application has been submitted successfully.');
            setIsSuccess(true);
            setShowSuccessModal(true);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            // Show error modal
            setLoading(false);
            setSuccessTitle('Submission Failed');
            setSuccessMessage(errorMessage);
            setIsSuccess(false);
            setShowSuccessModal(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    if (isSuccess) {
                        navigate('/');
                    }
                }}
                title={successTitle}
                message={successMessage}
                type={isSuccess ? 'success' : 'error'}
            />
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
                <p className="text-slate-500">Initiate a new loan application for a customer.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">Error submitting application</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-8">

                {/* Loan Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Loan Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Loan ID is auto-generated */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">PKS Number & Company</label>
                            <select
                                value={selectedPKS}
                                onChange={(e) => setSelectedPKS(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            >
                                <option value="">Select PKS Company</option>
                                {pksCompanies.map((company) => (
                                    <option key={company.id} value={`${company.pksNumber} - ${company.companyName}`}>
                                        {company.pksNumber} - {company.companyName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kredit Product</label>
                            <select
                                name="kreditProduct"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                            >
                                <option value="">Select Product</option>
                                {options.productOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {selectedProduct === 'Other' && (
                                <input
                                    type="text"
                                    className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                    placeholder="Specify other product"
                                    value={otherProduct}
                                    onChange={(e) => setOtherProduct(e.target.value)}
                                />
                            )}
                            {/* Conditional Input for Other Product */}
                            {/* We need to check the select value, but since it's uncontrolled, we might need to change it to controlled or check ref. 
                                For simplicity, let's make it controlled or use a small state for visibility if we want to keep it uncontrolled-ish.
                                Actually, let's just make the select controlled for cleaner "Others" handling or use a state that updates on change.
                             */}
                            {/* Re-implementing as controlled for cleaner "Others" logic would be best, but let's stick to the pattern. 
                                 I'll add a state to track the selected value for these dropdowns to toggle the input.
                             */}
                        </div>
                        {/* Wait, I need to track the selected value to show the input. Let's add state for selected values. */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sales ID</label>
                            <input
                                name="salesId"
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="e.g. S-12345"
                            />
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                name="name"
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                            <input
                                name="nik"
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="16-digit NIK"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Debtor Occupation</label>
                            {/* Changed to select for consistency with requirement, assuming occupationOptions is now used */}
                            <select
                                name="debtorOccupation"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                value={selectedOccupation}
                                onChange={(e) => setSelectedOccupation(e.target.value)}
                            >
                                <option value="">Select Occupation</option>
                                {options.occupationOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {selectedOccupation === 'Lainnya' && (
                                <input
                                    type="text"
                                    className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                    placeholder="Specify other occupation"
                                    value={otherOccupation}
                                    onChange={(e) => setOtherOccupation(e.target.value)}
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Income</label>
                            <MoneyInput
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                value={income}
                                onChange={setIncome}
                                placeholder="Rp 0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Years of Service</label>
                            <input
                                name="yearsOfService"
                                type="number"
                                min="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="e.g. 5"
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Emergency Contact</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                            <input
                                name="emergencyName"
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="Emergency contact name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input
                                name="emergencyPhone"
                                type="tel"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="+62 xxx xxxx xxxx"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                            <select
                                name="emergencyRelationship"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                value={selectedRelationship}
                                onChange={(e) => setSelectedRelationship(e.target.value)}
                            >
                                <option value="">Select Relationship</option>
                                {options.relationshipOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {selectedRelationship === 'Others' && (
                                <input
                                    type="text"
                                    className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                    placeholder="Specify other relationship"
                                    value={otherRelationship}
                                    onChange={(e) => setOtherRelationship(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Document Uploads */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Documents</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">National ID (KTP)</label>
                            <input
                                name="nationalIdFile"
                                type="file"
                                accept="image/*,.pdf"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">NPWP</label>
                            <input
                                name="npwpFile"
                                type="file"
                                accept="image/*,.pdf"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            />
                        </div>
                    </div>
                </div>

                {/* Loan Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Loan Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (IDR)</label>
                            <MoneyInput
                                name="amount"
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                value={amount}
                                onChange={setAmount}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tenor (Months)</label>
                            <select
                                name="tenor"
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            >
                                <option value="">Select Tenor</option>
                                {options.tenorOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Banking Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Banking Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                            <select
                                name="bankName"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                            >
                                <option value="">Select Bank</option>
                                {options.bankOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {selectedBank === 'Lainnya' && (
                                <input
                                    type="text"
                                    className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                    placeholder="Specify other bank"
                                    value={otherBank}
                                    onChange={(e) => setOtherBank(e.target.value)}
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                            <input
                                name="accountNumber"
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="Account number"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={payrollAccount}
                                    onChange={(e) => setPayrollAccount(e.target.checked)}
                                    className="w-4 h-4 text-bni-teal border-slate-300 rounded focus:ring-bni-teal"
                                />
                                <span className="text-sm font-medium text-slate-700">Has Payroll Account</span>
                            </label>
                        </div>
                        {payrollAccount && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payroll Account Number</label>
                                <input
                                    name="payrollAccountNumber"
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                    placeholder="Payroll account number"
                                />
                            </div>
                        )}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Existing Loans / Monthly Installments</label>
                            <textarea
                                name="existingLoans"
                                rows={2}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="Describe existing loans or monthly installment obligations"
                            />
                        </div>
                    </div>
                </div>

                {/* Preferred Disbursement Account */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Preferred Disbursement Account</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Name</label>
                            <input
                                name="disbursementRecipientName"
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="Account holder name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                            <select
                                name="disbursementBankName"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            >
                                <option value="">Select Bank</option>
                                {options.bankOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                            <input
                                name="disbursementAccountNumber"
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="Account number"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-bni-teal text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};
