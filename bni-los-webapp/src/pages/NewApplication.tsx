import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import type { Application } from '../types';

export const NewApplication = () => {
    const navigate = useNavigate();
    const { addApplication } = useData();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newApp: Application = {
                id: `APP-${Math.floor(Math.random() * 10000)}`,
                customerId: `CUST-${Math.floor(Math.random() * 10000)}`,
                customerName: (e.target as any).name.value,
                loanAmount: parseInt((e.target as any).amount.value),
                tenor: parseInt((e.target as any).tenor.value),
                status: 'Submitted',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            addApplication(newApp);
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
                <p className="text-slate-500">Initiate a new loan application for a customer.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
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
                                placeholder="e.g. Budi Santoso"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                            <input
                                name="nik"
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                                placeholder="16 digit NIK"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input
                            name="phone"
                            required
                            type="tel"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            placeholder="0812..."
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Loan Details</h3>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (Rp)</label>
                        <input
                            name="amount"
                            required
                            type="number"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                            placeholder="e.g. 50000000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tenor (Months)</label>
                        <select
                            name="tenor"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-teal/20 focus:border-bni-teal"
                        >
                            <option value="12">12 Months</option>
                            <option value="24">24 Months</option>
                            <option value="36">36 Months</option>
                            <option value="48">48 Months</option>
                            <option value="60">60 Months</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-bni-orange text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};
