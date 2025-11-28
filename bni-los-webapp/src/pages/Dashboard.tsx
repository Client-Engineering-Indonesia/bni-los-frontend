import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { ApplicationStatus } from '../types';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const styles = {
        'Draft': 'bg-slate-100 text-slate-700',
        'Submitted': 'bg-blue-100 text-blue-700',
        'Internal Checking': 'bg-indigo-100 text-indigo-700',
        'External Checking': 'bg-purple-100 text-purple-700',
        'EDD Required': 'bg-orange-100 text-orange-700',
        'Verification': 'bg-cyan-100 text-cyan-700',
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

export const Dashboard = () => {
    const { user } = useAuth();
    const { applications } = useData();
    const navigate = useNavigate();

    if (!user) return null;

    // Filter applications based on role
    const getFilteredApplications = () => {
        switch (user.role) {
            case 'Sales':
                return applications; // Sales sees all their apps (simplified)
            case 'ICR':
                return applications.filter(app => ['Internal Checking', 'External Checking'].includes(app.status));
            case 'Supervisor':
                return applications.filter(app => ['Submitted', 'EDD Required'].includes(app.status));
            case 'Analyst':
                return applications.filter(app => ['Verification'].includes(app.status));
            case 'Approver':
                return applications.filter(app => ['Approval'].includes(app.status));
            case 'Operation':
                return applications.filter(app => ['Disbursement Ready', 'Disbursed'].includes(app.status));
            default:
                return applications;
        }
    };

    const filteredApps = getFilteredApplications();

    const stats = [
        { label: 'Total Applications', value: filteredApps.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Action', value: filteredApps.filter(a => a.status !== 'Disbursed' && a.status !== 'Rejected').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Completed', value: filteredApps.filter(a => a.status === 'Disbursed').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
                <p className="text-slate-500">Here's what's happening with your loan applications today.</p>
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="font-bold text-slate-900">Worklist</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Application ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{app.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <div>{app.customerName}</div>
                                        <div className="text-xs text-slate-400">{app.customerId}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        Rp {app.loanAmount.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(app.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/application/${app.id}`)}
                                            className="text-bni-teal hover:text-bni-orange font-medium text-sm"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
