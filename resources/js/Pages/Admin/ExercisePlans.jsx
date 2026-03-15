import React, { useState, useEffect, useCallback } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Check,
    Dumbbell,
    Users,
    Activity,
    Calendar,
    ChevronRight,
    Weight,
    Layers,
    AlertCircle,
} from "lucide-react";
import { debounce } from "lodash";

export default function ExercisePlans({
    plans = [],
    stats = {},
    bmiCategories = [],
    filters = {},
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: "",
        description: "",
        total_days: 30,
        target_weight_loss: "",
        min_bmi_category: "",
        max_bmi_category: "",
        difficulty_level: "Beginner",
        status: "unpublished",
    });

    // Debounced Search Logic
    const updateSearch = useCallback(
        debounce((query) => {
            router.get(
                route("exercise-plans.index"),
                { search: query },
                { preserveState: true, replace: true },
            );
        }, 300),
        [],
    );

    useEffect(() => {
        updateSearch(searchQuery);
    }, [searchQuery]);

    const openCreateModal = () => {
        setEditingPlan(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (plan) => {
        setEditingPlan(plan);
        setData({
            name: plan.name || "",
            description: plan.description || "",
            total_days: plan.total_days || 30,
            target_weight_loss: plan.target_weight_loss || "",
            min_bmi_category: plan.min_bmi_category || "",
            max_bmi_category: plan.max_bmi_category || "",
            difficulty_level: plan.difficulty_level || "Beginner",
            status: plan.status || "unpublished",
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPlan) {
            put(route("exercise-plans.update", editingPlan.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route("exercise-plans.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (
            confirm(
                "Are you sure you want to delete this plan? All associated exercise schedules will be lost.",
            )
        ) {
            destroy(route("exercise-plans.destroy", id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Exercise Plans Management" />

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Exercise Plans
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Design routines and assign exercises to specific
                            days.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all font-bold shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <Plus size={20} /> Create New Plan
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={<Layers className="text-blue-600" />}
                        label="Total Plans"
                        value={stats.total}
                    />
                    <StatCard
                        icon={<Check className="text-green-600" />}
                        label="Published"
                        value={stats.active}
                    />
                    <StatCard
                        icon={<AlertCircle className="text-orange-600" />}
                        label="Drafts"
                        value={stats.inactive}
                    />
                    <StatCard
                        icon={<Users className="text-purple-600" />}
                        label="Participants"
                        value={stats.totalParticipants}
                    />
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="relative max-w-md">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search by plan name..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
                        >
                            {/* Card Content */}
                            <div className="p-8 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            plan.status === "published"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {plan.status}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(plan)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(plan.id)
                                            }
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                                    {plan.description}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar
                                                size={16}
                                                className="text-blue-500"
                                            />
                                            <span className="text-xs font-bold uppercase tracking-tight">
                                                Duration
                                            </span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900">
                                            {plan.total_days} Days
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Activity
                                                size={16}
                                                className="text-orange-500"
                                            />
                                            <span className="text-xs font-bold uppercase tracking-tight">
                                                Difficulty
                                            </span>
                                        </div>
                                        <span className="text-sm font-black text-gray-900">
                                            {plan.difficulty_level}
                                        </span>
                                    </div>

                                    <div className="pt-2 flex flex-wrap gap-2">
                                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[11px] font-bold">
                                            <Weight size={12} /> BMI:{" "}
                                            {plan.min_bmi_category} -{" "}
                                            {plan.max_bmi_category}
                                        </div>
                                        {plan.target_weight_loss && (
                                            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[11px] font-bold">
                                                Target:{" "}
                                                {plan.target_weight_loss}kg
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action - Link to Pivot Table Management */}
                            <Link
                                href={route("plan-exercises.manage", plan.id)}
                                className="w-full py-5 bg-gray-900 text-white flex items-center justify-center gap-3 font-bold text-sm hover:bg-blue-600 transition-colors group-hover:gap-5"
                            >
                                MANAGE EXERCISES <ChevronRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {plans.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Dumbbell
                            size={48}
                            className="mx-auto text-gray-200 mb-4"
                        />
                        <h3 className="text-lg font-bold text-gray-400">
                            No plans found
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Create your first plan to get started.
                        </p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingPlan ? "Edit Plan" : "New Plan"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Plan Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Plan Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-200 border-2"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* BMI Categories - TWO INPUTS ADDED HERE */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Min BMI Category
                                    </label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 border-2 text-sm"
                                        value={data.min_bmi_category}
                                        onChange={(e) =>
                                            setData(
                                                "min_bmi_category",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Select Min...</option>
                                        {bmiCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Max BMI Category
                                    </label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 border-2 text-sm"
                                        value={data.max_bmi_category}
                                        onChange={(e) =>
                                            setData(
                                                "max_bmi_category",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Select Max...</option>
                                        {bmiCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Total Days
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border-gray-200 border-2"
                                        value={data.total_days}
                                        onChange={(e) =>
                                            setData(
                                                "total_days",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Weight Loss (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full rounded-xl border-gray-200 border-2"
                                        value={data.target_weight_loss}
                                        onChange={(e) =>
                                            setData(
                                                "target_weight_loss",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Logic Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Difficulty
                                    </label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 border-2"
                                        value={data.difficulty_level}
                                        onChange={(e) =>
                                            setData(
                                                "difficulty_level",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="Beginner">
                                            Beginner
                                        </option>
                                        <option value="Intermediate">
                                            Intermediate
                                        </option>
                                        <option value="Advanced">
                                            Advanced
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 border-2"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="unpublished">
                                            Unpublished
                                        </option>
                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    className="w-full rounded-xl border-gray-200 border-2"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    required
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-100 text-gray-600 rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-50"
                                >
                                    {editingPlan
                                        ? "Update Plan"
                                        : "Create Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
        <div className="p-4 bg-gray-50 rounded-2xl">{icon}</div>
        <div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">
                {label}
            </p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);