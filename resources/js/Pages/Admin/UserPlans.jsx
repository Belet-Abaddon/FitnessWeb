import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Calendar, TrendingDown, Users, Search, Filter, Eye, CheckCircle, 
    ChevronDown, ChevronUp, Activity, CalendarDays, Timer
} from "lucide-react";

const UserPlansManagement = ({ dbUserPlans, exercisePlans }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedPlan, setSelectedPlan] = useState("all");
    const [sortField, setSortField] = useState("start_date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const plansPerPage = 10;

    // Stats Calculation
    const stats = {
        total: dbUserPlans.length,
        active: dbUserPlans.filter(p => p.status === 'active').length,
        completed: dbUserPlans.filter(p => p.status === 'completed').length,
        avgWeightLoss: (dbUserPlans.reduce((sum, p) => sum + p.weight_loss, 0) / (dbUserPlans.length || 1)).toFixed(1)
    };

    // Sorting & Filtering Logic
    const filteredPlans = dbUserPlans
        .filter(plan => {
            const matchesSearch = plan.user_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus;
            const matchesPlan = selectedPlan === "all" || plan.plan_id.toString() === selectedPlan;
            return matchesSearch && matchesStatus && matchesPlan;
        })
        .sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            return sortDirection === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
        });

    const currentPlans = filteredPlans.slice((currentPage - 1) * plansPerPage, currentPage * plansPerPage);

    const getStatusColor = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800 border-green-200",
            completed: "bg-blue-100 text-blue-800 border-blue-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
                {/* 1. Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Plans Management</h1>
                        <p className="text-gray-500">Assign and track exercise plans for users</p>
                    </div>
                </div>

                {/* 2. Stats Cards (Exact Design) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Plans" value={stats.total} subtext={`${new Set(dbUserPlans.map(p => p.user_id)).size} users`} icon={<Calendar />} color="blue" />
                    <StatCard title="Active Plans" value={stats.active} subtext="Currently training" icon={<Activity />} color="green" />
                    <StatCard title="Completed" value={stats.completed} subtext="Successfully finished" icon={<CheckCircle />} color="blue" />
                    <StatCard title="Avg. Weight Loss" value={`${stats.avgWeightLoss} kg`} subtext="Per enrollment" icon={<TrendingDown />} color="purple" />
                </div>

                {/* 3. Distribution Overview */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Plan Status Distribution</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['active', 'completed', 'cancelled'].map(status => (
                            <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-green-500' : status === 'completed' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                                    <span className="capitalize font-medium">{status}</span>
                                </div>
                                <span className="font-bold">{dbUserPlans.length ? Math.round((dbUserPlans.filter(p => p.status === status).length / dbUserPlans.length) * 100) : 0}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Filters (Exact Design) */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" placeholder="Search user or plan..." 
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select className="px-4 py-2 border rounded-lg" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select className="px-4 py-2 border rounded-lg" value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
                            <option value="all">All Plans</option>
                            {exercisePlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* 5. The Main Table (Exact Design) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Plan Details</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Timeline</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Progress</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">BMI & Weight</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {currentPlans.map((plan) => (
                                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{plan.user_name.charAt(0)}</div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{plan.user_name}</p>
                                                    <p className="text-xs text-gray-500">{plan.user_email}</p>
                                                    <p className="text-xs text-gray-600 mt-1">Current BMI: {plan.user_bmi}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-900">{plan.plan_name}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <CalendarDays size={14} />
                                                <span>{plan.plan_duration_weeks} weeks</span>
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded uppercase">{plan.plan_difficulty}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 text-[10px]">Adherence: {plan.adherence_rate}%</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">Start: {plan.start_date}</div>
                                            <div className="text-sm">End: {plan.end_date}</div>
                                            {plan.status === 'active' && (
                                                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium mt-1">
                                                    <Timer size={12} /> {plan.days_remaining} days left
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium">{plan.progress}%</span>
                                                {plan.weight_loss > 0 && <span className="text-xs text-green-600 flex items-center font-bold">-{plan.weight_loss}kg lost</span>}
                                            </div>
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${plan.progress}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm">Start BMI: {plan.start_bmi} → {plan.end_bmi || '...'}</div>
                                            <div className="text-xs text-gray-500">Weight: {plan.current_weight}kg → {plan.target_weight}kg</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(plan.status)} uppercase`}>
                                                {plan.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><Eye size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ title, value, subtext, icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
            </div>
            <div className={`p-2 bg-${color}-50 text-${color}-600 rounded-lg`}>{icon}</div>
        </div>
        <div className="mt-3 text-sm text-gray-500">{subtext}</div>
    </div>
);

export default UserPlansManagement;