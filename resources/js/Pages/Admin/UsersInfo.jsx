import React, { useState, useEffect } from 'react'; // Added hooks
import AdminLayout from '@/Layouts/AdminLayout';
import { Users as UsersIcon, ShieldCheck, UserCog, RefreshCw, Search, X } from 'lucide-react'; // Added Search/X icons
import { router, usePage } from '@inertiajs/react';

const UserManagement = ({ users, filters }) => {
    const { flash } = usePage().props;
    
    // Search state initialized with the current filter from the URL
    const [search, setSearch] = useState(filters.search || '');

    // Debounce Search Logic: Updates the URL after 300ms of no typing
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('users.index'), { search: search }, {
                preserveState: true,
                replace: true, // Prevents filling up browser history
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const memberCount = users.filter(u => u.role === 'user').length;

    const handleRoleChange = (id, newRole) => {
        router.patch(route('users.update-role', id), {
            role: newRole
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-50 min-h-screen space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Access Management</h1>
                    
                    {/* Search Input Box */}
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button 
                                onClick={() => setSearch('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X size={16} className="text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    {flash?.message && (
                        <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-200">
                            {flash.message}
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><UsersIcon size={20}/></div>
                        <div><p className="text-xs text-gray-500">Total Users</p><p className="text-xl font-bold">{totalUsers}</p></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><ShieldCheck size={20}/></div>
                        <div><p className="text-xs text-gray-500">Total Admins</p><p className="text-xl font-bold">{adminCount}</p></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><UserCog size={20}/></div>
                        <div><p className="text-xs text-gray-500">Members</p><p className="text-xl font-bold">{memberCount}</p></div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                            <tr>
                                <th className="p-4">User Details</th>
                                <th className="p-4 text-center">Current Role</th>
                                <th className="p-4 text-right">Update Permissions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm text-gray-600">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-gray-500 text-xs">{user.email}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <select 
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="text-xs border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 py-1 cursor-pointer"
                                            >
                                                <option value="user">Assign User</option>
                                                <option value="admin">Assign Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-12 text-center text-gray-400">
                                        No users found matching "{search}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <p className="text-xs text-gray-400 italic font-medium mt-2 flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin-slow"/> 
                    Showing {users.length} results. Roles are saved instantly to the database.
                </p>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;