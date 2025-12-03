import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { ApplicationStatus, PKSCompany } from '../types';
import { FileText, Clock, CheckCircle, Plus, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useWorklist } from '../hooks/useWorklist';

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const styles = {
        'Draft': 'bg-slate-100 text-slate-700',
        'Submitted': 'bg-blue-100 text-blue-700',
        'Internal Checking': 'bg-indigo-100 text-indigo-700',
        'External Checking': 'bg-purple-100 text-purple-700',
        'EDD Required': 'bg-orange-100 text-orange-700',
        'Supervisor Review': 'bg-cyan-100 text-cyan-700',
        'Analyst Review': 'bg-pink-100 text-pink-700',
        'Approval': 'bg-yellow-100 text-yellow-700',
        'Approved': 'bg-green-100 text-green-700',
        'Rejected': 'bg-red-100 text-red-700',
        'Disbursement Ready': 'bg-teal-100 text-teal-700',
        'Disbursed': 'bg-emerald-100 text-emerald-700',
    };

    return (
        <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status])}>
            {status}
        </span>
    );
};

// Format numbers with period separator (Indonesian format)
const formatMoney = (amount: number): string => {
    return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

export const Dashboard = () => {
    const { user } = useAuth();
    const {

        pksCompanies,
        addPKSCompany,
        setApplications,
        setPagination: setContextPagination,
        setLoading: setContextLoading,
        setError: setContextError
    } = useData();
    const navigate = useNavigate();

    if (!user) return null;

    // Call API with role-specific parameters
    // Sales: uses salesId parameter on /worklist-sales endpoint
    // Others: use user parameter on /worklist endpoint
    const {
        applications: apiApplications,
        pagination,
        isLoading,
        error,
        refetch,
        setPage
    } = useWorklist(user.role, user?.salesId, 1, 10);

    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'applications' | 'pks'>('applications');
    const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
    const [newCompany, setNewCompany] = useState({ pksNumber: '', companyName: '' });

    // Sync API data with context whenever it changes
    useEffect(() => {
        if (apiApplications.length > 0) {
            setApplications(apiApplications);
            setContextPagination(pagination);
        }
        setContextLoading(isLoading);
        setContextError(error);
    }, [apiApplications, pagination, isLoading, error, setApplications, setContextPagination, setContextLoading, setContextError]);

    if (!user) return null;

    // Filter applications based on role
    const getFilteredApplications = () => {
        let apps = apiApplications;

        // TEMPORARY: Allow all roles to see all applications to verify table rendering
        // Since API only returns 'External Checking' items for non-Sales, strict filtering would hide them
        /*
        switch (user.role) {
            case 'Sales':
                break;
            case 'ICR':
                apps = apiApplications.filter(app => ['Submitted', 'Internal Checking', 'External Checking'].includes(app.status));
                break;
            case 'Supervisor':
                apps = apiApplications.filter(app => ['Supervisor Review'].includes(app.status));
                break;
            case 'Analyst':
                apps = apiApplications.filter(app => ['Analyst Review'].includes(app.status));
                break;
            case 'Approver':
                apps = apiApplications.filter(app => ['Approval'].includes(app.status));
                break;
            case 'Operation':
                apps = apiApplications.filter(app => ['Disbursement Ready', 'Disbursed'].includes(app.status));
                break;
            default:
                break;
        }
        */


        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            apps = apps.filter(app =>
                app.customerName.toLowerCase().includes(query) ||
                (app.nik && app.nik.includes(query)) ||
                app.id.toLowerCase().includes(query) ||
                (app.salesId && app.salesId.toLowerCase().includes(query))
            );
        }

        return apps;
    };

    const filteredApps = getFilteredApplications();

    const stats = [
        { label: 'Total Applications', value: filteredApps.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Action', value: filteredApps.filter(a => a.status !== 'Disbursed' && a.status !== 'Rejected').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Completed', value: filteredApps.filter(a => a.status === 'Disbursed').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    const handleAddCompany = () => {
        if (!newCompany.pksNumber || !newCompany.companyName) return;

        const company: PKSCompany = {
            id: `PKS-${Math.floor(Math.random() * 10000)}`,
            pksNumber: newCompany.pksNumber,
            companyName: newCompany.companyName,
            createdAt: new Date().toISOString(),
        };

        addPKSCompany(company);
        setNewCompany({ pksNumber: '', companyName: '' });
        setShowAddCompanyModal(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
                    <p className="text-slate-500">Here's what's happening with your loan applications today.</p>
                </div>
                {user.role === 'Sales' && (
                    <div className="w-72">
                        <input
                            type="text"
                            placeholder="Search Customer Name, NIK, or ID..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={clsx("p-3 rounded-lg", stat.bg)}>
                                <stat.icon className={clsx("w-6 h-6", stat.color)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs for Operations */}
            {user.role === 'Operation' && (
                <div className="border-b border-slate-200">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('applications')}
                            className={clsx(
                                "px-4 py-2 font-medium border-b-2 transition-colors",
                                activeTab === 'applications'
                                    ? "border-bni-teal text-bni-teal"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Applications
                        </button>
                        <button
                            onClick={() => setActiveTab('pks')}
                            className={clsx(
                                "px-4 py-2 font-medium border-b-2 transition-colors",
                                activeTab === 'pks'
                                    ? "border-bni-teal text-bni-teal"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            PKS Companies
                        </button>
                    </div>
                </div>
            )}

            {/* Applications Table */}
            {(user.role !== 'Operation' || activeTab === 'applications') && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-900">Worklist</h2>
                        {!isLoading && !error && (
                            <div className="text-sm text-slate-500">
                                Page {pagination.page} of {pagination.totalPages} • Total: {pagination.total} applications
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-bni-teal animate-spin" />
                            <span className="ml-3 text-slate-600">Loading worklist...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {!isLoading && error && (
                        <div className="flex items-center justify-center py-16">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <div className="ml-3">
                                <p className="text-red-600 font-medium">Failed to load worklist</p>
                                <p className="text-sm text-slate-500">{error}</p>
                                <button
                                    onClick={refetch}
                                    className="mt-2 text-bni-teal hover:text-bni-orange font-medium text-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Data Table */}
                    {!isLoading && !error && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Application ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredApps.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                                                    No applications found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredApps.map((app) => (
                                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{app.id}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{app.salesId || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        <div>{app.customerName}</div>
                                                        <div className="text-xs text-slate-400">{app.customerId}</div>
                                                        {app.nik && <div className="text-xs text-slate-400">NIK: {app.nik}</div>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {formatMoney(app.loanAmount)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={app.status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {new Date(app.updatedAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => navigate(`/application/${app.id}`)}
                                                                className="text-bni-teal hover:text-bni-orange font-medium text-sm"
                                                            >
                                                                View Details
                                                            </button>
                                                            {user.role === 'Sales' && (
                                                                <button
                                                                    onClick={() => setDeleteConfirm(app.id)}
                                                                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setPage(Math.max(1, pagination.page - 1))}
                                        disabled={pagination.page === 1}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm",
                                            pagination.page === 1
                                                ? "text-slate-400 cursor-not-allowed"
                                                : "text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>

                                    <div className="text-sm text-slate-600">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </div>

                                    <button
                                        onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm",
                                            pagination.page === pagination.totalPages
                                                ? "text-slate-400 cursor-not-allowed"
                                                : "text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* PKS Companies Table (Operations only) */}
            {user.role === 'Operation' && activeTab === 'pks' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-900">PKS Companies</h2>
                        <button
                            onClick={() => setShowAddCompanyModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-bni-teal text-white rounded-lg hover:bg-teal-700"
                        >
                            <Plus size={18} />
                            Add New Company
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">PKS Number</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Company Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Ownership</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Group</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Scheme</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Address</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">PKS Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">PKS Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-slate-900">Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pksCompanies.map((company) => (
                                    <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{company.pksNumber}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.companyName}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.companyOwnership || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.groupInstitution || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.companyType || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.collaborationScheme || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.companyStatus || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.companyAddress || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.pksCooperationType || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${company.pksStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {company.pksStatus || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{company.pksExpiryDate || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Company Modal */}
            {showAddCompanyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Add New PKS Company</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">PKS Number</label>
                                <input
                                    type="text"
                                    value={newCompany.pksNumber}
                                    onChange={(e) => setNewCompany({ ...newCompany, pksNumber: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                    placeholder="e.g. PKS-2024-009"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={newCompany.companyName}
                                    onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                    placeholder="e.g. PT Example Company"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowAddCompanyModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCompany}
                                className="px-4 py-2 bg-bni-teal text-white rounded-lg font-medium hover:bg-teal-700"
                            >
                                Add Company
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Confirm Deletion</h2>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete application {deleteConfirm}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!deleteConfirm) return;

                                    try {
                                        setContextLoading(true);
                                        // 1. Fetch latest worklist to get the PIID
                                        // We need to find the item that matches the ID we want to delete
                                        const worklistData = await import('../services/api').then(m =>
                                            m.fetchWorklist('Sales', user?.salesId || '35246', 1, 100)
                                        );

                                        // Find the item with matching loanId or applicationId
                                        // Note: loanId is nested inside loanApplication.loanInformation
                                        const targetItem = worklistData.worklists.find(item =>
                                            item.loanApplication?.loanInformation?.loanId === deleteConfirm ||
                                            item.applicationId === deleteConfirm ||
                                            item.piid === deleteConfirm
                                        );

                                        if (!targetItem || !targetItem.piid) {
                                            throw new Error('Could not find process ID (PIID) for this application');
                                        }

                                        // 2. Call terminate API with the PIID
                                        await import('../services/api').then(m =>
                                            m.terminateLoanApplication(targetItem.piid)
                                        );

                                        // 3. Success - refresh the list
                                        setDeleteConfirm(null);
                                        refetch();

                                    } catch (err) {
                                        const msg = err instanceof Error ? err.message : 'Failed to delete application';
                                        setContextError(msg);
                                        setDeleteConfirm(null);
                                    } finally {
                                        setContextLoading(false);
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
