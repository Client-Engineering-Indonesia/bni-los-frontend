import { useAuth } from '../context/AuthContext';
import { MOCK_USERS } from '../data/mockData';
import { ShieldCheck } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role: any) => {
        login(role);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-bni-orange/10 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-bni-orange" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">BNI LOS Login</h1>
                    <p className="text-slate-500">Select a role to simulate the flow</p>
                </div>

                <div className="space-y-3">
                    {MOCK_USERS.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleLogin(user.role)}
                            className="w-full p-4 text-left border border-slate-200 rounded-xl hover:border-bni-teal hover:bg-bni-teal/5 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900 group-hover:text-bni-teal">{user.role}</p>
                                    <p className="text-sm text-slate-500">{user.name}</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-bni-teal" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
