import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    CheckCircle,
    LogOut,
    PlusCircle,
    RefreshCw
} from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const getNavItems = () => {
        switch (user.role) {
            case 'Sales':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
                    { icon: PlusCircle, label: 'New Application', path: '/new-application' },
                ];
            case 'ICR':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
                    { icon: CheckCircle, label: 'Pending Checks', path: '/pending-checks' },
                ];
            default:
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
                ];
        }
    };

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold text-bni-orange">BNI LOS</h1>
                <p className="text-xs text-slate-400 mt-1">Fleksi Loan Origination</p>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                {getNavItems().map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            isActive
                                ? "bg-bni-teal text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.role}</p>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => navigate('/role-selector')}
                        className="w-full flex items-center gap-2 px-4 py-2 mb-2 text-sm text-bni-orange hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} />
                        Switch Role
                    </button>
                )}
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
};
