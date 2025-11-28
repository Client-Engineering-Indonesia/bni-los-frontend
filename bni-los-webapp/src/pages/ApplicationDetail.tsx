import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { ApplicationStatus } from '../types';

export const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getApplication, updateApplicationStatus } = useData();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showDisbursementModal, setShowDisbursementModal] = useState(false);
    const [disbursementForm, setDisbursementForm] = useState({
        accountNumber: '',
        bankName: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const application = getApplication(id || '');

    if (!application || !user) {
        return <div>Application not found</div>;
    }

    const handleAction = (newStatus: ApplicationStatus) => {
        setLoading(true);
        setTimeout(() => {
            updateApplicationStatus(application.id, newStatus);
            setLoading(false);
            navigate('/');
        }, 1000);
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

    const renderActions = () => {
        switch (user.role) {
            case 'ICR':
                if (application.status === 'Internal Checking') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('External Checking')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Approve Internal Check
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
                                onClick={() => handleAction('Verification')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Approve External Check
                            </button>
                        </div>
                    );
                }
                break;
            case 'Supervisor':
                if (application.status === 'Submitted') {
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('Internal Checking')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Approve Submission
                            </button>
                            <button
                                onClick={() => handleAction('EDD Required')}
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
                if (application.status === 'Verification') {
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
                    return (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleAction('Disbursement Ready')}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-slate-900">{application.id}</h1>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                {application.status}
                            </span>
                        </div>
                        <p className="text-slate-500">Created on {new Date(application.createdAt).toLocaleDateString()}</p>
                    </div>
                    {renderActions()}
                </div>

                <div className="p-8 grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-slate-500">Full Name</label>
                                <p className="font-medium text-slate-900">{application.customerName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-500">Customer ID</label>
                                <p className="font-medium text-slate-900">{application.customerId}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Loan Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm text-slate-500">Loan Amount</label>
                                <p className="font-medium text-slate-900">Rp {application.loanAmount.toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                                <label className="text-sm text-slate-500">Tenor</label>
                                <p className="font-medium text-slate-900">{application.tenor} Months</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


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
        </div>
    );
};
