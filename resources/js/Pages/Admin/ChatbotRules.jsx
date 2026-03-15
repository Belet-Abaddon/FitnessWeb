import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    MessageSquare,
    Search,
    Edit,
    Trash2,
    Eye,
    Plus,
    RefreshCw,
    X,
    Save,
    BarChart3,
    Brain,
    Tag,
    Utensils,
    Coffee,
    Sun,
    Moon
} from 'lucide-react';

const ChatbotRules = () => {
    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBMICategory, setSelectedBMICategory] = useState('all');
    const [selectedRules, setSelectedRules] = useState([]);
    const [editingRule, setEditingRule] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState(null);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [selectedRuleDetails, setSelectedRuleDetails] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const rulesPerPage = 8;
    const [currentUser, setCurrentUser] = useState({ id: 1, name: 'Admin' });

    // Mock rules data matching database schema
    const initialRules = [
        {
            id: 1,
            keyword: 'breakfast',
            response_text: 'For a healthy breakfast: Oatmeal with berries and nuts, or eggs with whole grain toast. Include protein and fiber.',
            category: 'breakfast',
            bmi_category: 'normal',
            created_by: 1,
            created_at: '2024-01-15',
            updated_at: '2024-01-15',
            usage: 1452,
            lastUsed: '2 hours ago'
        },
        {
            id: 2,
            keyword: 'breakfast for weight loss',
            response_text: 'Low-calorie breakfast options: Greek yogurt with berries, vegetable omelette, or protein smoothie with spinach.',
            category: 'breakfast',
            bmi_category: 'overweight',
            created_by: 1,
            created_at: '2024-01-20',
            updated_at: '2024-01-20',
            usage: 892,
            lastUsed: '1 day ago'
        },
        {
            id: 3,
            keyword: 'lunch',
            response_text: 'Balanced lunch: Grilled chicken with quinoa and vegetables, or lentil soup with whole grain bread.',
            category: 'lunch',
            bmi_category: 'normal',
            created_by: 1,
            created_at: '2024-02-01',
            updated_at: '2024-02-01',
            usage: 1673,
            lastUsed: '30 minutes ago'
        },
        {
            id: 4,
            keyword: 'lunch for athletes',
            response_text: 'High-protein lunch: Salmon with sweet potato and broccoli, or chicken breast with brown rice and greens.',
            category: 'lunch',
            bmi_category: 'athlete',
            created_by: 1,
            created_at: '2024-01-10',
            updated_at: '2024-01-10',
            usage: 2345,
            lastUsed: '5 minutes ago'
        },
        {
            id: 5,
            keyword: 'dinner',
            response_text: 'Light dinner: Baked fish with steamed vegetables, or vegetable stir-fry with tofu. Avoid heavy carbs.',
            category: 'dinner',
            bmi_category: 'normal',
            created_by: 1,
            created_at: '2024-02-15',
            updated_at: '2024-02-15',
            usage: 987,
            lastUsed: '3 hours ago'
        },
        {
            id: 6,
            keyword: 'dinner for weight gain',
            response_text: 'Calorie-dense dinner: Lean steak with mashed potatoes, or pasta with chicken and vegetables.',
            category: 'dinner',
            bmi_category: 'underweight',
            created_by: 1,
            created_at: '2024-01-30',
            updated_at: '2024-01-30',
            usage: 1234,
            lastUsed: '2 days ago'
        },
        {
            id: 7,
            keyword: 'vegetarian breakfast',
            response_text: 'Vegetarian breakfast: Tofu scramble with vegetables, chia seed pudding, or whole grain toast with avocado.',
            category: 'breakfast',
            bmi_category: 'vegetarian',
            created_by: 1,
            created_at: '2024-01-05',
            updated_at: '2024-01-05',
            usage: 756,
            lastUsed: '3 days ago'
        },
        {
            id: 8,
            keyword: 'diabetic dinner',
            response_text: 'Diabetic-friendly dinner: Grilled chicken with non-starchy vegetables, or fish with salad. Monitor carb intake.',
            category: 'dinner',
            bmi_category: 'diabetic',
            created_by: 1,
            created_at: '2024-02-10',
            updated_at: '2024-02-10',
            usage: 645,
            lastUsed: '1 week ago'
        }
    ];

    const [rules, setRules] = useState(initialRules);
    const [newRule, setNewRule] = useState({
        keyword: '',
        response_text: '',
        category: 'breakfast',
        bmi_category: 'normal',
        created_by: 1
    });

    // Options
    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'breakfast', label: 'Breakfast', icon: Coffee },
        { value: 'lunch', label: 'Lunch', icon: Sun },
        { value: 'dinner', label: 'Dinner', icon: Moon }
    ];

    const bmiCategoryOptions = [
        { value: 'all', label: 'All BMI Categories' },
        { value: 'underweight', label: 'Underweight', color: 'bg-blue-100 text-blue-800' },
        { value: 'normal', label: 'Normal', color: 'bg-green-100 text-green-800' },
        { value: 'overweight', label: 'Overweight', color: 'bg-orange-100 text-orange-800' },
        { value: 'obese', label: 'Obese', color: 'bg-red-100 text-red-800' },
        { value: 'athlete', label: 'Athlete', color: 'bg-purple-100 text-purple-800' },
        { value: 'diabetic', label: 'Diabetic', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'vegetarian', label: 'Vegetarian', color: 'bg-emerald-100 text-emerald-800' }
    ];

    // Filter rules
    const filteredRules = rules
        .filter(rule => {
            const matchesSearch = rule.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 rule.response_text.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;
            const matchesBMICategory = selectedBMICategory === 'all' || rule.bmi_category === selectedBMICategory;
            return matchesSearch && matchesCategory && matchesBMICategory;
        })
        .sort((a, b) => a.keyword.localeCompare(b.keyword));

    // Pagination
    const indexOfLastRule = currentPage * rulesPerPage;
    const indexOfFirstRule = indexOfLastRule - rulesPerPage;
    const currentRules = filteredRules.slice(indexOfFirstRule, indexOfLastRule);
    const totalPages = Math.ceil(filteredRules.length / rulesPerPage);

    // Helper functions
    const getCategoryColor = (category) => {
        switch (category) {
            case 'breakfast': return 'bg-orange-100 text-orange-800';
            case 'lunch': return 'bg-yellow-100 text-yellow-800';
            case 'dinner': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'breakfast': return <Coffee className="h-4 w-4" />;
            case 'lunch': return <Sun className="h-4 w-4" />;
            case 'dinner': return <Moon className="h-4 w-4" />;
            default: return <Utensils className="h-4 w-4" />;
        }
    };

    const getBMICategoryColor = (bmiCategory) => {
        const option = bmiCategoryOptions.find(opt => opt.value === bmiCategory);
        return option ? option.color : 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    // CRUD Operations
    const handleViewRule = (rule) => {
        setSelectedRuleDetails(rule);
        setShowRuleModal(true);
    };

    const handleEditRule = (rule) => {
        setEditingRule({ ...rule });
    };

    const handleSaveEdit = () => {
        if (editingRule) {
            const updatedRule = {
                ...editingRule,
                updated_at: new Date().toISOString().split('T')[0]
            };
            setRules(rules.map(rule => 
                rule.id === editingRule.id ? updatedRule : rule
            ));
            setEditingRule(null);
        }
    };

    const handleDeleteRule = (ruleId) => {
        setRuleToDelete(ruleId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setRules(rules.filter(rule => rule.id !== ruleToDelete));
        setShowDeleteModal(false);
        setRuleToDelete(null);
        setSelectedRules(selectedRules.filter(id => id !== ruleToDelete));
    };

    const handleAddRule = () => {
        const newId = rules.length > 0 ? Math.max(...rules.map(r => r.id)) + 1 : 1;
        
        const ruleToAdd = {
            id: newId,
            ...newRule,
            created_by: currentUser.id,
            created_at: new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString().split('T')[0],
            usage: 0,
            lastUsed: 'Never'
        };

        setRules([...rules, ruleToAdd]);
        setNewRule({
            keyword: '',
            response_text: '',
            category: 'breakfast',
            bmi_category: 'normal',
            created_by: currentUser.id
        });
        setShowAddModal(false);
    };

    const handleNewRuleChange = (field, value) => {
        setNewRule(prev => ({ ...prev, [field]: value }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggleSelectAll = () => {
        if (selectedRules.length === currentRules.length) {
            setSelectedRules([]);
        } else {
            setSelectedRules(currentRules.map(rule => rule.id));
        }
    };

    const toggleRuleSelection = (ruleId) => {
        setSelectedRules(prev =>
            prev.includes(ruleId)
                ? prev.filter(id => id !== ruleId)
                : [...prev, ruleId]
        );
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Delete ${selectedRules.length} rules?`)) {
            setRules(rules.filter(rule => !selectedRules.includes(rule.id)));
            setSelectedRules([]);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Diet Chatbot Rules</h1>
                        <p className="mt-1 text-gray-600">Manage AI responses for meal recommendations</p>
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Diet Rule
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                <Coffee className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Breakfast Rules</p>
                                <p className="text-xl font-semibold">
                                    {rules.filter(r => r.category === 'breakfast').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                <Sun className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Lunch Rules</p>
                                <p className="text-xl font-semibold">
                                    {rules.filter(r => r.category === 'lunch').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <Moon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Dinner Rules</p>
                                <p className="text-xl font-semibold">
                                    {rules.filter(r => r.category === 'dinner').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search diet rules..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-48">
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full md:w-48">
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedBMICategory}
                                onChange={(e) => setSelectedBMICategory(e.target.value)}
                            >
                                {bmiCategoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button 
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSelectedBMICategory('all');
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Rules Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedRules.length === currentRules.length && currentRules.length > 0}
                                    onChange={toggleSelectAll}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="ml-3 text-sm text-gray-700">
                                    {selectedRules.length > 0 
                                        ? `${selectedRules.length} selected` 
                                        : `${filteredRules.length} rules`
                                    }
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 w-12">
                                        <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Keyword
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        BMI Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentRules.map((rule) => (
                                    <tr key={rule.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRules.includes(rule.id)}
                                                onChange={() => toggleRuleSelection(rule.id)}
                                                className="h-4 w-4 text-blue-600 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <MessageSquare className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="font-medium text-gray-900">{rule.keyword}</div>
                                                    <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                        {rule.response_text}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {getCategoryIcon(rule.category)}
                                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getCategoryColor(rule.category)}`}>
                                                    {rule.category}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getBMICategoryColor(rule.bmi_category)}`}>
                                                {rule.bmi_category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <BarChart3 className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium">{rule.usage}</div>
                                                    <div className="text-xs text-gray-500">{rule.lastUsed}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {formatDate(rule.created_at)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                By: User {rule.created_by}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleViewRule(rule)}
                                                    className="p-1 text-gray-400 hover:text-blue-600"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleEditRule(rule)}
                                                    className="p-1 text-gray-400 hover:text-green-600"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRule(rule.id)}
                                                    className="p-1 text-gray-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {indexOfFirstRule + 1} to {Math.min(indexOfLastRule, filteredRules.length)} of {filteredRules.length} rules
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 border rounded text-sm ${
                                        currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 border rounded text-sm ${
                                            currentPage === page
                                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 border rounded text-sm ${
                                        currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Rule Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 lg:w-2/3 shadow-lg rounded-xl bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Create Diet Rule</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <span className="text-red-500">*</span> Keyword / Trigger
                                            </label>
                                            <input
                                                type="text"
                                                value={newRule.keyword}
                                                onChange={(e) => handleNewRuleChange('keyword', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., breakfast for weight loss"
                                                required
                                            />
                                            <p className="mt-1 text-sm text-gray-500">Keyword that users will type to trigger this response</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <span className="text-red-500">*</span> Meal Category
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {categoryOptions.filter(o => o.value !== 'all').map(option => {
                                                    const Icon = option.icon;
                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => handleNewRuleChange('category', option.value)}
                                                            className={`p-4 rounded-lg border flex flex-col items-center justify-center ${
                                                                newRule.category === option.value
                                                                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                                    : 'bg-gray-50 border-gray-300 text-gray-700'
                                                            }`}
                                                        >
                                                            <Icon className="h-5 w-5 mb-2" />
                                                            <span className="text-sm">{option.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                BMI Category
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {bmiCategoryOptions.filter(o => o.value !== 'all').map(option => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => handleNewRuleChange('bmi_category', option.value)}
                                                        className={`p-3 rounded-lg border text-sm ${
                                                            newRule.bmi_category === option.value
                                                                ? `${option.color.replace('100', '50')} border-blue-300`
                                                                : 'bg-gray-50 border-gray-300 text-gray-700'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <span className="text-red-500">*</span> Diet Recommendation
                                            </label>
                                            <textarea
                                                value={newRule.response_text}
                                                onChange={(e) => handleNewRuleChange('response_text', e.target.value)}
                                                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter the diet recommendation..."
                                                required
                                            />
                                            <p className="mt-1 text-sm text-gray-500">Detailed meal recommendation for users</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAddRule}
                                            disabled={!newRule.keyword || !newRule.response_text}
                                            className={`px-6 py-3 rounded-lg text-white ${
                                                !newRule.keyword || !newRule.response_text
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        >
                                            <Plus className="h-4 w-4 inline mr-2" />
                                            Create Rule
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Rule Modal */}
                {editingRule && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 lg:w-2/3 shadow-lg rounded-xl bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Edit Diet Rule</h2>
                                <button onClick={() => setEditingRule(null)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                                        <input
                                            type="text"
                                            value={editingRule.keyword}
                                            onChange={(e) => setEditingRule({...editingRule, keyword: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meal Category</label>
                                        <select
                                            value={editingRule.category}
                                            onChange={(e) => setEditingRule({...editingRule, category: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {categoryOptions.filter(o => o.value !== 'all').map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Diet Recommendation</label>
                                    <textarea
                                        value={editingRule.response_text}
                                        onChange={(e) => setEditingRule({...editingRule, response_text: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="4"
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">BMI Category</label>
                                        <select
                                            value={editingRule.bmi_category}
                                            onChange={(e) => setEditingRule({...editingRule, bmi_category: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {bmiCategoryOptions.filter(o => o.value !== 'all').map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditingRule(null)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Save className="h-4 w-4 inline mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white">
                            <div className="text-center">
                                <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Diet Rule</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete this diet recommendation rule? This action cannot be undone.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Rule Modal */}
                {showRuleModal && selectedRuleDetails && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-4 mx-auto p-5 border w-11/12 lg:w-3/4 shadow-lg rounded-xl bg-white">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <Brain className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedRuleDetails.keyword}</h2>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedRuleDetails.category)}`}>
                                                {getCategoryIcon(selectedRuleDetails.category)}
                                                <span className="ml-1">{selectedRuleDetails.category}</span>
                                            </span>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getBMICategoryColor(selectedRuleDetails.bmi_category)}`}>
                                                {selectedRuleDetails.bmi_category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowRuleModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-3">Diet Recommendation</h3>
                                        <div className="bg-white p-4 rounded border">
                                            <p className="text-gray-700 whitespace-pre-line">{selectedRuleDetails.response_text}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Meal Type:</span>
                                                <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(selectedRuleDetails.category)}`}>
                                                    {selectedRuleDetails.category}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">BMI Category:</span>
                                                <span className={`px-2 py-1 text-xs rounded ${getBMICategoryColor(selectedRuleDetails.bmi_category)}`}>
                                                    {selectedRuleDetails.bmi_category}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Usage:</span>
                                                <span className="font-medium">{selectedRuleDetails.usage}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Last Used:</span>
                                                <span className="text-sm">{selectedRuleDetails.lastUsed}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Created:</span>
                                                <span className="text-sm">{formatDate(selectedRuleDetails.created_at)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Created By:</span>
                                                <span className="text-sm">User {selectedRuleDetails.created_by}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowRuleModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        handleEditRule(selectedRuleDetails);
                                        setShowRuleModal(false);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Edit className="h-4 w-4 inline mr-2" />
                                    Edit Rule
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Actions */}
                {selectedRules.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
                        <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4">
                            <span className="text-sm">{selectedRules.length} selected</span>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={handleBulkDelete}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                            <button 
                                onClick={() => setSelectedRules([])}
                                className="text-gray-300 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ChatbotRules;