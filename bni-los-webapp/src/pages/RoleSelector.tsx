import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, Shield, Activity, CheckCircle, Settings } from 'lucide-react';
import type { Role } from '../types';

const roleConfigs = [
    {
        role: 'Sales' as Role,
        name: 'Sales',
        description: 'Create and manage loan applications',
        icon: Users,
        color: 'bg-blue-50 text-blue-600 border-blue-200',
        hoverColor: 'hover:bg-blue-100 hover:border-blue-400',
    },
    {
        role: 'ICR' as Role,
        name: 'ICR',
        description: 'Internal & External Credit Risk checking',
        icon: FileText,
        color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        hoverColor: 'hover:bg-indigo-100 hover:border-indigo-400',
    },
    {
        role: 'Supervisor' as Role,
        name: 'Supervisor',
        description: 'Review applications and request EDD',
        icon: Shield,
        color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
        hoverColor: 'hover:bg-cyan-100 hover:border-cyan-400',
    },
    {
        role: 'Analyst' as Role,
        name: 'Analyst',
        description: 'Analyze and evaluate loan applications',
        icon: Activity,
        color: 'bg-pink-50 text-pink-600 border-pink-200',
        hoverColor: 'hover:bg-pink-100 hover:border-pink-400',
    },
    {
        role: 'Approver' as Role,
        name: 'Approver',
        description: 'Final approval with checklist validation',
        icon: CheckCircle,
        color: 'bg-green-50 text-green-600 border-green-200',
        hoverColor: 'hover:bg-green-100 hover:border-green-400',
    },
    {
        role: 'Operation' as Role,
        name: 'Operation',
        description: 'Handle disbursement and operations',
        icon: Settings,
        color: 'bg-teal-50 text-teal-600 border-teal-200',
        hoverColor: 'hover:bg-teal-100 hover:border-teal-400',
    },
];

export const RoleSelector = () => {
    const { switchRole, isAdmin } = useAuth();
    const navigate = useNavigate();

    if (!isAdmin) {
        navigate('/');
        return null;
    }

    const handleRoleSelect = (role: Role) => {
        switchRole(role);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
            <div className="w-full max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">Admin Role Selector</h1>
                    <p className="text-lg text-slate-600">Choose a role to navigate the system from that perspective</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roleConfigs.map((config) => {
                        const Icon = config.icon;
                        return (
                            <button
                                key={config.role}
                                onClick={() => handleRoleSelect(config.role)}
                                className={`bg-white p-6 rounded-xl border-2 transition-all ${config.color} ${config.hoverColor} text-left group`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${config.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{config.name}</h3>
                                        <p className="text-sm text-slate-600">{config.description}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                        Enter as {config.name} →
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};
