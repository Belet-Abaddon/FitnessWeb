import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import FitnessLayout from "@/Layouts/FitnessLayout";
import { Clock, Flame, Scale, Target } from "lucide-react"; // Added missing icons

export default function Workouts({
    workoutPlans = [],
    currentUserPlan = null,
    userBmiCategory = "Overweight",
}) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPlanDetails, setShowPlanDetails] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        "Underweight",
        "Normal weight",
        "Overweight",
        "Obese Class I",
        "Obese Class II",
        "Obese Class III (Morbidly Obese)",
    ];

    const handleJoinPlan = (id) => {
        router.post(
            route("workouts.join"),
            { plan_id: id },
            {
                onSuccess: () => {
                    alert("New plan activated!");
                    setShowPlanDetails(false);
                },
            },
        );
    };

    const activePlan = currentUserPlan || {
        name: "No Active Plan Selected",
        progress: 0,
        startDate: "N/A",
        endDate: "N/A",
        completedWorkouts: 0,
        totalWorkouts: 0,
        nextWorkout: "Select a plan below",
    };

    const filteredPlans =
        selectedCategory === "All"
            ? workoutPlans
            : workoutPlans.filter((plan) => plan.category === selectedCategory);

    return (
        <FitnessLayout>
            <Head title="Workout Plans" />

            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Workout Plans
                            </h1>
                            <p className="text-blue-100">
                                Recommended for your category:{" "}
                                <strong>{userBmiCategory}</strong>
                            </p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Active Plan Card */}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full mb-3 inline-block">
                                Your Active Plan
                            </span>
                            <h2 className="text-2xl font-bold mb-2">
                                {activePlan.name}
                            </h2>
                            <div className="flex flex-wrap gap-4 text-sm opacity-90">
                                <span>Started: {activePlan.startDate}</span>
                                <span>Ends: {activePlan.endDate}</span>
                                <span>Next: {activePlan.nextWorkout}</span>
                            </div>
                        </div>
                        <Link
                            href={route("dashboard")}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold mt-4 md:mt-0 inline-block text-center"
                        >
                            {currentUserPlan
                                ? "Continue Training"
                                : "Pick a Plan Below"}
                        </Link>
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>
                                {activePlan.completedWorkouts} /{" "}
                                {activePlan.totalWorkouts} Days
                            </span>
                        </div>
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                            <div
                                className="bg-white h-3 rounded-full transition-all duration-700"
                                style={{ width: `${activePlan.progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Browse Plans
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                                    selectedCategory === cat
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col group overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <span
                                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                                            plan.category === userBmiCategory
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {plan.category === userBmiCategory
                                            ? "Recommended"
                                            : plan.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase">
                                        <Clock size={14} /> {plan.duration}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {plan.name}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {plan.description}
                                </p>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-6 border-y border-slate-50 mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                                            <Flame size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                Avg Burn
                                            </p>
                                            <p className="text-sm font-black text-slate-700">
                                                {plan.est_calories} kcal
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                            <Scale size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                Target Loss
                                            </p>
                                            <p className="text-sm font-black text-slate-700">
                                                {plan.target_weight}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                                            <Target size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                Difficulty
                                            </p>
                                            <p className="text-sm font-black text-slate-700">
                                                {plan.level}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                                Daily Time
                                            </p>
                                            <p className="text-sm font-black text-slate-700">
                                                {plan.daily_minutes}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            setShowPlanDetails(true);
                                        }}
                                        className="flex-1 py-4 rounded-2xl bg-indigo-50 font-black text-xs text-indigo-600 hover:bg-indigo-100 transition border border-indigo-100"
                                    >
                                        DETAILS
                                    </button>

                                    <button
                                        onClick={() => handleJoinPlan(plan.id)}
                                        className="flex-[2] py-4 rounded-2xl bg-blue-600 text-white font-black text-xs hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-200 p-3"
                                    >
                                        START JOURNEY
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showPlanDetails && selectedPlan && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {selectedPlan.name}
                                </h2>
                                <p className="text-emerald-100 text-sm opacity-90">
                                    {selectedPlan.duration} •{" "}
                                    {selectedPlan.level}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPlanDetails(false)}
                                className="hover:bg-white/20 p-2 rounded-full transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="mb-8">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Goal & Focus
                                </h3>
                                <p className="text-slate-600 leading-relaxed italic">
                                    "{selectedPlan.longDescription}"
                                </p>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Workout Schedule
                                </h3>

                                {selectedPlan.exercises_by_day.map(
                                    (dayData) => (
                                        <div
                                            key={dayData.day}
                                            className="relative pl-6 border-l-2 border-emerald-100"
                                        >
                                            {/* Day Marker Dot */}
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>

                                            <h4 className="font-bold text-slate-900 mb-3">
                                                Day {dayData.day}
                                            </h4>
                                            <div className="grid gap-2">
                                                {dayData.exercises.map(
                                                    (ex, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-emerald-200 transition-colors"
                                                        >
                                                            <span className="text-sm font-medium text-slate-700">
                                                                {ex.title}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                                                    {
                                                                        ex.duration
                                                                    }{" "}
                                                                    MIN
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                            <button
                                onClick={() => handleJoinPlan(selectedPlan.id)}
                                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition transform active:scale-95 shadow-lg shadow-emerald-100"
                            >
                                START THIS JOURNEY
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FitnessLayout>
    );
}
