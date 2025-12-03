import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MoneyInput } from '../components/MoneyInput';
import type { Application } from '../types';

export const NewApplication = () => {
    const navigate = useNavigate();
    const { addApplication, pksCompanies, options } = useData();
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget;

        // Get all form inputs
        const getInputValue = (name: string) => {
            const element = form.elements.namedItem(name);
            return element instanceof HTMLInputElement ? element.value : '';
        };

        const fileInput = form.elements.namedItem('nationalIdFile') as HTMLInputElement;
        const npwpInput = form.elements.namedItem('npwpFile') as HTMLInputElement;
        const tenorInput = form.elements.namedItem('tenor') as HTMLSelectElement;

        const nationalIdFile = fileInput?.files?.[0] ? URL.createObjectURL(fileInput.files[0]) : undefined;
        const npwpFile = npwpInput?.files?.[0] ? URL.createObjectURL(npwpInput.files[0]) : undefined;

        const selectedCompany = pksCompanies.find(c => c.pksNumber === selectedPKS);

        setTimeout(() => {
            const newApp: Application = {
                id: `APP-${Math.floor(Math.random() * 10000)}`,
                customerId: `CUST-${Math.floor(Math.random() * 10000)}`,
                customerName: getInputValue('name'),
                nik: getInputValue('nik'),
                salesId: getInputValue('salesId'),
                loanAmount: amount,
                tenor: parseInt(tenorInput.value, 10),
                status: 'Submitted',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                nationalIdFile,
                // New fields
                loanId: `LN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                pksNumber: selectedPKS,
                pksCompanyName: selectedCompany?.companyName,
                kreditProduct: getInputValue('kreditProduct') === 'Other' ? otherProduct : getInputValue('kreditProduct'),
                npwpFile,
                debtorOccupation: getInputValue('debtorOccupation') === 'Lainnya' ? otherOccupation : getInputValue('debtorOccupation'),
                emergencyContact: {
                    name: getInputValue('emergencyName'),
                    phone: getInputValue('emergencyPhone'),
                    relationship: getInputValue('emergencyRelationship') === 'Others' ? otherRelationship : getInputValue('emergencyRelationship'),
                },
                income: income,
                yearsOfService: Number(getInputValue('yearsOfService')),
                bankingInfo: {
                    bankName: getInputValue('bankName') === 'Lainnya' ? otherBank : getInputValue('bankName'),
                    accountNumber: getInputValue('accountNumber'),
                    payrollAccount,
                    payrollAccountNumber: payrollAccount ? getInputValue('payrollAccountNumber') : undefined,
                    existingLoans: getInputValue('existingLoans'),
                    disbursementAccount: {
                        recipientName: getInputValue('disbursementRecipientName'),
                        bankName: getInputValue('disbursementBankName'),
                        accountNumber: getInputValue('disbursementAccountNumber'),
                    },
                },
            };

            addApplication(newApp);
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
                <p className="text-slate-500">Initiate a new loan application for a customer.</p>
            </div>

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
                                    <option key={company.id} value={company.pksNumber}>
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
