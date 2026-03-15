import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    BarChart3, Search, Filter, MoreVertical, Edit, Trash2, Eye, Calendar,
    TrendingUp, TrendingDown, ChevronDown, ChevronUp, Download, Plus,
    RefreshCw, X, Save, User, Weight, Scale, Target, AlertTriangle,
    CheckCircle, Clock, Hash, Activity, Thermometer, LineChart, FileText,
    Users, ArrowUpRight, ArrowDownRight, TrendingUpIcon,
} from "lucide-react";

// Props added to receive database data
const BMIRecords = ({ dbRecords = [], dbUsers = [] }) => {
    // State management - Initialized with Database Data
    const [records, setRecords] = useState(dbRecords);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedUser, setSelectedUser] = useState("all");
    const [dateRange, setDateRange] = useState("all");
    const [sortField, setSortField] = useState("recordedDate");
    const [sortDirection, setSortDirection] = useState("desc");
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [selectedRecordDetails, setSelectedRecordDetails] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeChart, setActiveChart] = useState("trend");
    const recordsPerPage = 10;

    // Use users from database
    const users = dbUsers;

    // Options for dropdowns
    const categoryOptions = [
        { value: "all", label: "All BMI Categories" },
        { value: "Overweight", label: "Overweight (25-29.9)" },
        { value: "Obese I", label: "Obese I (30-34.9)" },
        { value: "Obese II", label: "Obese II (35-39.9)" },
        { value: "Obese III", label: "Obese III (40+)" },
    ];

    const userOptions = [
        { value: "all", label: "All Users" },
        ...users.map((user) => ({
            value: user.id.toString(),
            label: user.name,
        })),
    ];

    // ... All helper functions (getBMIColor, getStatusColor, calculateBMI, etc.)
    // remain exactly as they were in your uploaded file ...
    const getBMIColor = (bmiCategory) => {
        switch (bmiCategory) {
            case "Overweight": return "bg-yellow-100 text-yellow-800";
            case "Obese I": return "bg-orange-100 text-orange-800";
            case "Obese II": return "bg-red-100 text-red-800";
            case "Obese III": return "bg-red-600 text-white";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "improving": return "bg-green-100 text-green-800";
            case "worsening": return "bg-red-100 text-red-800";
            case "stable": return "bg-blue-100 text-blue-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case "Low": return "bg-green-100 text-green-800";
            case "Moderate": return "bg-yellow-100 text-yellow-800";
            case "High": return "bg-orange-100 text-orange-800";
            case "Very High": return "bg-red-100 text-red-800";
            case "Severe": return "bg-red-600 text-white";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // Filter and sort records logic
    const filteredRecords = records
        .filter((record) => {
            const matchesSearch = record.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 record.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || record.bmiCategory === selectedCategory;
            const matchesUser = selectedUser === "all" || record.userId.toString() === selectedUser;
            return matchesSearch && matchesCategory && matchesUser;
        })
        .sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
            return aValue < bValue ? 1 : -1;
        });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    // Statistics calculations
    const stats = {
        totalRecords: records.length,
        avgBMI: records.length > 0 ? (records.reduce((sum, r) => sum + r.bmiValue, 0) / records.length).toFixed(1) : 0,
        improvingCount: records.filter((r) => r.status === "improving").length,
        worseningCount: records.filter((r) => r.status === "worsening").length,
        avgChange: records.length > 0 ? (records.reduce((sum, r) => sum + (r.change || 0), 0) / records.length).toFixed(1) : 0,
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">BMI Records</h1>
                        <p className="mt-1 text-gray-600">Track and manage BMI measurements for overweight and obese users</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Records</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRecords}</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Average BMI</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgBMI}</p>
                            </div>
                            <Scale className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Improving</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.improvingCount}</p>
                            </div>
                            <TrendingDown className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg Change</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgChange}</p>
                            </div>
                            <TrendingUpIcon className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by user name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Change</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status & Risk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{record.userName}</div>
                                            <div className="text-sm text-gray-500">{record.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="text-lg font-bold mr-2">{record.bmiValue}</span>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${getBMIColor(record.bmiCategory)}`}>
                                                    {record.bmiCategory}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">{formatDate(record.recordedDate)}</div>
                                            <div className="text-sm font-medium">
                                                {record.change < 0 ? (
                                                    <span className="text-green-600">-{Math.abs(record.change)}</span>
                                                ) : (
                                                    <span className="text-red-600">+{record.change}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                                                {record.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="h-4 w-4" /></button>
                                            <button className="p-1 text-gray-400 hover:text-green-600"><Edit className="h-4 w-4" /></button>
                                            <button className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records</div>
                        <div className="flex space-x-2">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BMIRecords;