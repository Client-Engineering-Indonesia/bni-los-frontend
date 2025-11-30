import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [salesId, setSalesId] = useState('');
    const [selectedRole, setSelectedRole] = useState('Auto-detect');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        let role = 'Sales';

        if (selectedRole !== 'Auto-detect') {
            role = selectedRole;
        } else {
            // Auto-detect logic
            // Simple logic to determine role based on input
            // In a real app, this would be handled by the backend
            if (salesId) {
                role = 'Sales';
            } else if (email.includes('icr')) {
                role = 'ICR';
            } else if (email.includes('supervisor')) {
                role = 'Supervisor';
            } else if (email.includes('analyst')) {
                role = 'Analyst';
            } else if (email.includes('approver')) {
                role = 'Approver';
            } else if (email.includes('operation')) {
                role = 'Operation';
            } else if (email.includes('admin')) {
                role = 'Admin';
            }
        }

        login(role as any);

        // Redirect Admin to role selector, others to dashboard
        if (role === 'Admin') {
            navigate('/role-selector');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-bni-orange/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-bni-orange" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">BNI LOS Login</h1>
                    <p className="text-slate-500">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="Auto-detect">Auto-detect (based on Email/ID)</option>
                            <option value="Sales">Sales</option>
                            <option value="ICR">ICR</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Approver">Approver</option>
                            <option value="Operation">Operation</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address (Optional)</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            placeholder="name@bni.co.id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sales ID (Optional)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            placeholder="S-XXXXX"
                            value={salesId}
                            onChange={(e) => setSalesId(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">Required for Sales role</p>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            className="w-4 h-4 text-bni-teal border-slate-300 rounded focus:ring-bni-teal"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-bni-teal text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                    <p>For testing other roles, use emails containing role names:</p>
                    <p>admin@..., icr@..., supervisor@..., analyst@..., approver@..., operation@...</p>
                </div>
            </div>
        </div>
    );
};
