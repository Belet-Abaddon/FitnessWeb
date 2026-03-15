import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import {
    MessageSquare, Star, Search, Filter, Clock, CheckCircle, 
    Download, Reply, Archive, Trash2
} from 'lucide-react';

const FeedbackManagement = ({ feedbacks, stats, filters }) => {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Handle Search with debounce or manual trigger
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // Use router.get to refresh the data with the search query
        router.get(route('admin.feedback'), { search: value }, {
            preserveState: true,
            replace: true
        });
    };

    const renderStars = (rating) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    size={14} 
                    className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} 
                />
            ))}
        </div>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* --- STATS OVERVIEW --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Feedback" value={stats.total} icon={<MessageSquare />} color="blue" trend={stats.trend} />
                    <StatCard title="New" value={stats.new} icon={<Clock />} color="amber" />
                    <StatCard title="Avg Rating" value={stats.avgRating} icon={<Star />} color="purple" />
                    <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle />} color="emerald" />
                </div>

                {/* --- ACTION BAR --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search comments or users..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* --- FEEDBACK LIST --- */}
                <div className="space-y-4">
                    {feedbacks.data.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                            {item.user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-none">{item.user.name}</h4>
                                            <span className="text-xs text-gray-500 uppercase font-semibold">
                                                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                        item.priority === 'high' 
                                        ? 'bg-red-50 text-red-700 border-red-100' 
                                        : 'bg-gray-50 text-gray-600 border-gray-100'
                                    }`}>
                                        {item.priority} Priority
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.comment}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-4">
                                        {renderStars(item.rating)}
                                        <span className="text-xs text-gray-400 capitalize">#{item.status}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><Reply size={18}/></button>
                                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><Archive size={18}/></button>
                                        <button 
                                            onClick={() => router.delete(route('admin.feedback.destroy', item.id))}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {feedbacks.data.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No feedback found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-lg ${
            color === 'blue' ? 'bg-blue-50 text-blue-600' : 
            color === 'amber' ? 'bg-amber-50 text-amber-600' :
            color === 'purple' ? 'bg-purple-50 text-purple-600' :
            'bg-emerald-50 text-emerald-600'
        }`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {trend && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {trend}
                    </span>
                )}
            </div>
        </div>
    </div>
);

export default FeedbackManagement;