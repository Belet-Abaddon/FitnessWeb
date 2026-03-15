import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import FitnessLayout from "@/Layouts/FitnessLayout";
// Import Recharts for the line graph
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

export default function Progress({
    stats,
    weightHistory,
    userPlans,
    weeklyWorkouts,
    achievements,
}) {
    const [selectedTimeframe, setSelectedTimeframe] = useState("all");

    // Calculated Progress Values
    const weightToLose = Math.max(
        0,
        (stats.currentWeight - stats.goalWeight).toFixed(1),
    );
    const weightLossProgress =
        stats.startingWeight !== stats.goalWeight
            ? ((stats.startingWeight - stats.currentWeight) /
                  (stats.startingWeight - stats.goalWeight)) *
              100
            : 0;

    // Reverse data for the chart (Timeline from left to right)
    const chartData = [...weightHistory].reverse();

    return (
        <FitnessLayout>
            <Head title="My Progress - FitLife" />

            {/* Original Header Design (Blue to Green) */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                My Progress
                            </h1>
                            <p className="text-blue-100">
                                Track your journey since {stats.joinDate}
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-center">
                            <span className="text-sm opacity-90">
                                Member for
                            </span>
                            <p className="font-semibold text-xl">
                                {Math.floor(stats.totalDays)} days
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Original Stat Cards Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon="⚖️"
                        label="Current Weight"
                        value={`${stats.currentWeight} kg`}
                        subValue={`from ${stats.startingWeight} kg`}
                        change={stats.currentWeight - stats.startingWeight}
                        positive={stats.currentWeight <= stats.startingWeight}
                    />
                    <StatCard
                        icon="📊"
                        label="BMI"
                        value={stats.currentBMI.toFixed(1)}
                        subValue={`from ${stats.startingBMI.toFixed(1)}`}
                        change={stats.currentBMI - stats.startingBMI}
                        positive={stats.currentBMI <= stats.startingBMI}
                    />
                    <StatCard
                        icon="🎯"
                        label="Goal Weight"
                        value={`${stats.goalWeight} kg`}
                        subValue={`${weightToLose} kg to go`}
                        progress={weightLossProgress}
                    />
                    <StatCard
                        icon="🔥"
                        label="Current Streak"
                        value={`${stats.currentStreak} days`}
                        subValue="Keep it up!"
                        highlight={true}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Weight Trend Line Graph */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Weight Trend
                        </h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient
                                            id="colorWeight"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#2563eb"
                                                stopOpacity={0.1}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#2563eb"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        domain={["dataMin - 5", "dataMax + 5"]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        fill="url(#colorWeight)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Original Workout Bar Chart View */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Workout Activity
                        </h2>
                        <div className="text-center mb-6">
                            <span className="text-5xl font-bold text-blue-600">
                                {stats.workoutsCompleted}
                            </span>
                            <p className="text-gray-500 text-sm">
                                Total Workouts
                            </p>
                        </div>
                        <div className="mb-4">
                            <div className="flex items-end justify-between h-24 space-x-1">
                                {weeklyWorkouts.map((week, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center flex-1"
                                    >
                                        <div
                                            className="w-full bg-blue-600 rounded-t transition-all"
                                            style={{
                                                height: `${Math.min(week.count * 15, 80)}px`,
                                            }}
                                        ></div>
                                        <span className="text-[10px] text-gray-500 mt-1 uppercase">
                                            {week.week.substring(0, 3)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements & Plans Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Plans with Progress Bars */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            My Plans
                        </h2>
                        <div className="space-y-4">
                            {userPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium text-gray-900">
                                            {plan.name}
                                        </h3>
                                        <span
                                            className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                                plan.status === "active"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {plan.status}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-emerald-600 h-2 rounded-full"
                                            style={{
                                                width: `${plan.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {plan.workoutsCompleted} /{" "}
                                        {plan.totalWorkouts} Workouts Completed
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements with Icons */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Achievements
                        </h2>
                        <div className="space-y-3">
                            {achievements.map((ach) => (
                                <div
                                    key={ach.id}
                                    className={`flex items-center p-3 rounded-lg ${ach.unlocked ? "bg-emerald-50" : "bg-gray-50 opacity-60"}`}
                                >
                                    <span className="text-2xl mr-3">
                                        {ach.icon}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm text-gray-900">
                                            {ach.name}
                                        </h3>
                                        <p className="text-[11px] text-gray-500">
                                            {ach.description}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {ach.unlocked ? "UNLOCKED" : "LOCKED"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </FitnessLayout>
    );
}

// Reverted Stat Card Design
function StatCard({
    icon,
    label,
    value,
    subValue,
    change,
    positive,
    progress,
    highlight,
}) {
    return (
        <div
            className={`bg-white rounded-xl shadow-md p-5 border border-gray-100 ${highlight ? "ring-2 ring-emerald-500" : ""}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subValue && (
                        <p className="text-xs text-gray-500 mt-1">{subValue}</p>
                    )}
                    {change !== undefined && (
                        <p
                            className={`text-xs mt-2 ${positive ? "text-emerald-600" : "text-red-600"}`}
                        >
                            {positive ? "▼" : "▲"} {Math.abs(change).toFixed(1)}{" "}
                            total
                        </p>
                    )}
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
            {progress !== undefined && (
                <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}
