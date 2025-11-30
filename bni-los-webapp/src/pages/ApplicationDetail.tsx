import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import type { ApplicationStatus } from '../types';
import { MoneyInput } from '../components/MoneyInput';

export const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getApplication, updateApplicationStatus, deleteApplication } = useData();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDisbursementModal, setShowDisbursementModal] = useState(false);
    const [disbursementForm, setDisbursementForm] = useState({
        accountNumber: '',
        bankName: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [showEddModal, setShowEddModal] = useState(false);
    const [eddNotes, setEddNotes] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        customerName: '',
        nik: '',
        loanAmount: 0,
        tenor: 12,
        nationalIdFile: undefined as string | undefined
    });

    const application = getApplication(id || '');

    if (!application || !user) {
        return <div>Application not found</div>;
    }

    // Initialize edit form when application loads or edit mode starts
    const startEditing = () => {
        setEditForm({
            customerName: application.customerName,
            nik: application.nik || '',
            loanAmount: application.loanAmount,
            tenor: application.tenor,
            nationalIdFile: application.nationalIdFile
        });
        setIsEditing(true);
    };

    const handleAction = (newStatus: ApplicationStatus, data?: any) => {
        setLoading(true);
        setTimeout(() => {
            updateApplicationStatus(application.id, newStatus, data);
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    const handleEddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAction('EDD Required', { eddNotes });
        setShowEddModal(false);
    };

    const handleResubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAction('Submitted', {
            customerName: editForm.customerName,
            nik: editForm.nik,
            loanAmount: editForm.loanAmount,
            tenor: editForm.tenor,
            nationalIdFile: editForm.nationalIdFile,
            eddNotes: undefined // Clear EDD notes on resubmit
        });
    };

    const handleDisbursementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            updateApplicationStatus(application.id, 'Disbursed', {
                disbursementDetails: {
                    ...disbursementForm,
                    amount: Number(disbursementForm.amount)
                }
            });
            setLoading(false);
            setShowDisbursementModal(false);
            navigate('/');
        }, 1000);
    };

    const handleChecklistChange = (key: string, checked: boolean) => {
        const currentChecklist = application.approverChecklist || {
            creditScoreChecked: false,
            documentsVerified: false,
            collateralValuation: false,
            complianceCheck: false
        };

        updateApplicationStatus(application.id, application.status, {
            approverChecklist: {
                ...currentChecklist,
                [key]: checked
            }
        });
    };

    const renderActions = () => {
        switch (user.role) {
            case 'Sales':
                if (application.status === 'Submitted') {
                    return (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            <XCircle size={18} /> Delete
                        </button>
                    );
                }
                if (application.status === 'EDD Required') {
                    return (
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <button
                                    onClick={startEditing}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <FileText size={18} /> Edit Application
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleResubmit}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-bni-orange text-white rounded-lg hover:bg-orange-600"
                                    >
                                        <CheckCircle size={18} /> Save & Resubmit
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                }
                break;
            case 'ICR':
                if (application.status === 'Submitted') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('Internal Checking')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Start Internal Check
                            </button>
                        </div>
                    );
                }
                if (application.status === 'Internal Checking') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('External Checking')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Proceed to External Check
                            </button>
                            <button
                                onClick={() => handleAction('Rejected')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                        </div>
                    );
                }
                if (application.status === 'External Checking') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('Supervisor Review')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Submit to Supervisor
                            </button>
                        </div>
                    );
                }
                break;
            case 'Supervisor':
                if (application.status === 'Supervisor Review') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('Analyst Review')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Approve to Analyst
                            </button>
                            <button
                                onClick={() => setShowEddModal(true)}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                <AlertTriangle size={18} /> Request EDD
                            </button>
                        </div>
                    );
                }
                break;
            case 'Analyst':
                if (application.status === 'Analyst Review') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('Approval')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Submit for Approval
                            </button>
                        </div>
                    );
                }
                break;
            case 'Approver':
                if (application.status === 'Approval') {
                    const allChecked = application.approverChecklist &&
                        Object.values(application.approverChecklist).every(Boolean);

                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('Disbursement Ready')}
                                disabled={loading || !allChecked}
                                title={!allChecked ? "Please complete the checklist first" : ""}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircle size={18} /> Final Approval
                            </button>
                            <button
                                onClick={() => handleAction('Rejected')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <XCircle size={18} /> Reject
                            </button>
                        </div>
                    );
                }
                break;
            case 'Operation':
                if (application.status === 'Disbursement Ready') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDisbursementModal(true)}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                            >
                                <CheckCircle size={18} /> Disburse Funds
                            </button>
                        </div>
                    );
                }
                break;
        }
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto mb-20">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">{application.id}</h1>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                {application.status}
                            </span>
                        </div>
                        <p className="text-slate-500">Created on {new Date(application.createdAt).toLocaleDateString()}</p>
                        {application.salesId && (
                            <p className="text-slate-500 mt-1">Sales ID: <span className="font-medium text-slate-900">{application.salesId}</span></p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {renderActions()}
                    </div>
                </div>

                {application.status === 'EDD Required' && application.eddNotes && (
                    <div className="p-4 bg-orange-50 border-b border-orange-100">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-orange-600 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-semibold text-orange-900">EDD Required</h4>
                                <p className="text-orange-800 mt-1">{application.eddNotes}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-8 grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-slate-500">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1 border border-slate-200 rounded"
                                        value={editForm.customerName}
                                        onChange={e => setEditForm({ ...editForm, customerName: e.target.value })}
                                    />
                                ) : (
                                    <p className="font-medium text-slate-900">{application.customerName}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm text-slate-500">NIK</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1 border border-slate-200 rounded"
                                        value={editForm.nik}
                                        onChange={e => setEditForm({ ...editForm, nik: e.target.value })}
                                    />
                                ) : (
                                    <p className="font-medium text-slate-900">{application.nik || application.customerId}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm text-slate-500">National ID Document</label>
                                {isEditing ? (
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bni-teal/10 file:text-bni-teal hover:file:bg-bni-teal/20"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setEditForm({ ...editForm, nationalIdFile: URL.createObjectURL(file) });
                                                }
                                            }}
                                        />
                                        {editForm.nationalIdFile && <p className="text-xs text-green-600 mt-1">New file selected</p>}
                                    </div>
                                ) : (
                                    application.nationalIdFile && (
                                        <a
                                            href={application.nationalIdFile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block font-medium text-bni-teal hover:underline mt-1"
                                        >
                                            View Document
                                        </a>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Loan Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-slate-500">Loan Amount</label>
                                {isEditing ? (
                                    <MoneyInput
                                        className="w-full px-3 py-1 border border-slate-200 rounded"
                                        value={editForm.loanAmount}
                                        onChange={val => setEditForm({ ...editForm, loanAmount: val })}
                                    />
                                ) : (
                                    <p className="font-medium text-slate-900">Rp {application.loanAmount.toLocaleString('id-ID')}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm text-slate-500">Tenor</label>
                                {isEditing ? (
                                    <select
                                        className="w-full px-3 py-1 border border-slate-200 rounded"
                                        value={editForm.tenor}
                                        onChange={e => setEditForm({ ...editForm, tenor: Number(e.target.value) })}
                                    >
                                        <option value="12">12 Months</option>
                                        <option value="24">24 Months</option>
                                        <option value="36">36 Months</option>
                                        <option value="48">48 Months</option>
                                        <option value="60">60 Months</option>
                                    </select>
                                ) : (
                                    <p className="font-medium text-slate-900">{application.tenor} Months</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Information Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>
                </div>
                <div className="p-6">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Attribute</th>
                                <th className="px-6 py-3">Value</th>
                                <th className="px-6 py-3">Verified By</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-slate-900">Employment Status</td>
                                <td className="px-6 py-4">Permanent</td>
                                <td className="px-6 py-4">System</td>
                                <td className="px-6 py-4">2023-10-25</td>
                            </tr>
                            <tr className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-slate-900">Annual Income</td>
                                <td className="px-6 py-4">Rp 150.000.000</td>
                                <td className="px-6 py-4">System</td>
                                <td className="px-6 py-4">2023-10-25</td>
                            </tr>
                            <tr className="bg-white">
                                <td className="px-6 py-4 font-medium text-slate-900">Credit Score</td>
                                <td className="px-6 py-4">750 (High)</td>
                                <td className="px-6 py-4">System</td>
                                <td className="px-6 py-4">2023-10-25</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Approver Checklist */}
            {(user.role === 'Approver' || application.status === 'Approval' || application.status === 'Disbursement Ready' || application.status === 'Disbursed') && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Approver Checklist</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                                    checked={application.approverChecklist?.creditScoreChecked || false}
                                    onChange={(e) => handleChecklistChange('creditScoreChecked', e.target.checked)}
                                    disabled={user.role !== 'Approver' || application.status !== 'Approval'}
                                />
                                <span className="text-slate-700">Credit Score Verified</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                                    checked={application.approverChecklist?.documentsVerified || false}
                                    onChange={(e) => handleChecklistChange('documentsVerified', e.target.checked)}
                                    disabled={user.role !== 'Approver' || application.status !== 'Approval'}
                                />
                                <span className="text-slate-700">Documents Validated</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                                    checked={application.approverChecklist?.collateralValuation || false}
                                    onChange={(e) => handleChecklistChange('collateralValuation', e.target.checked)}
                                    disabled={user.role !== 'Approver' || application.status !== 'Approval'}
                                />
                                <span className="text-slate-700">Collateral Valuation Confirmed</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                                    checked={application.approverChecklist?.complianceCheck || false}
                                    onChange={(e) => handleChecklistChange('complianceCheck', e.target.checked)}
                                    disabled={user.role !== 'Approver' || application.status !== 'Approval'}
                                />
                                <span className="text-slate-700">Compliance Check Passed</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {
                showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Confirm Deletion</h2>
                            <p className="text-slate-600 mb-6">
                                Are you sure you want to delete application {application.id}? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        deleteApplication(application.id);
                                        navigate('/');
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showDisbursementModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Disbursement Details</h2>
                            <form onSubmit={handleDisbursementSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        value={disbursementForm.bankName}
                                        onChange={e => setDisbursementForm({ ...disbursementForm, bankName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        value={disbursementForm.accountNumber}
                                        onChange={e => setDisbursementForm({ ...disbursementForm, accountNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        value={disbursementForm.amount}
                                        onChange={e => setDisbursementForm({ ...disbursementForm, amount: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        value={disbursementForm.date}
                                        onChange={e => setDisbursementForm({ ...disbursementForm, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        rows={3}
                                        value={disbursementForm.notes}
                                        onChange={e => setDisbursementForm({ ...disbursementForm, notes: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowDisbursementModal(false)}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                    >
                                        {loading ? 'Processing...' : 'Confirm Disbursement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                showEddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Request EDD</h2>
                            <form onSubmit={handleEddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes for Sales</label>
                                    <textarea
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        rows={4}
                                        placeholder="Explain what documents or information are missing..."
                                        value={eddNotes}
                                        onChange={e => setEddNotes(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowEddModal(false)}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};
