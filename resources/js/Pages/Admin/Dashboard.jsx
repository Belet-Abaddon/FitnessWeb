import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import axios from "axios";
import {
    Users, Dumbbell, MessageSquare, BarChart3, TrendingUp, Activity, 
    Heart, ClipboardCheck, Clock, Target, Weight, Scale, Droplets, 
    Shield, ArrowUp, ArrowDown, AlertTriangle, CheckCircle, UserCheck, Flame
} from "lucide-react";

const Dashboard = ({ initialData }) => {
    // Initialize with Inertia props or empty defaults
    const [loading, setLoading] = useState(!initialData);
    const [dashboardData, setDashboardData] = useState(initialData || {
        stats: [],
        recentActivities: [],
        bmiDistribution: [],
        healthMetrics: [],
        recentUsers: [],
        safetyMetrics: [],
        weightLossProgress: { avgMonthlyLoss: "0", successRate: 0, totalWeightLost: "0" },
        exerciseCategories: []
    });

    // Refresh data if needed or if initialData wasn't provided
    useEffect(() => {
        if (!initialData) {
            fetchDashboardData();
        }
    }, [initialData]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName, className = "h-5 w-5") => {
        const icons = {
            Users: <Users className={className} />,
            Dumbbell: <Dumbbell className={className} />,
            MessageSquare: <MessageSquare className={className} />,
            Scale: <Scale className={className} />,
            Activity: <Activity className={className} />,
            ClipboardCheck: <ClipboardCheck className={className} />,
            Weight: <Weight className={className} />,
            CheckCircle: <CheckCircle className={className} />,
            AlertTriangle: <AlertTriangle className={className} />,
            UserCheck: <UserCheck className={className} />,
            Droplets: <Droplets className={className} />,
            Heart: <Heart className={className} />,
            Shield: <Shield className={className} />,
            TrendingUp: <TrendingUp className={className} />,
            Target: <Target className={className} />,
            Flame: <Flame className={className} />
        };
        return icons[iconName] || <Activity className={className} />;
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Safe Exercise Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Monitoring overweight and obese users for safe exercise
                        progression
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardData.stats && dashboardData.stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        {stat.trend === "up" ? (
                                            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                        ) : (
                                            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                        )}
                                        <span
                                            className={`text-sm font-medium ${stat.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            from last month
                                        </span>
                                    </div>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    {getIcon(stat.icon, "h-6 w-6 text-white")}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Recent Activities & Health Metrics */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Recent User Activities
                                </h2>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                        Overweight
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                        Obese
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {dashboardData.recentActivities && dashboardData.recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                    >
                                        <div
                                            className={`p-2 rounded-lg ${activity.color}`}
                                        >
                                            {getIcon(activity.icon, "h-5 w-5")}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                <span className="font-semibold">
                                                    {activity.user}
                                                </span>{" "}
                                                {activity.action}
                                            </p>
                                            <div className="flex items-center mt-1">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                                        activity.bmiCategory ===
                                                        "obese"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {activity.bmiCategory.toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-3">
                                                    {activity.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Health Metrics */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {dashboardData.healthMetrics && dashboardData.healthMetrics.map((metric, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {metric.label}
                                            </p>
                                            <p className="text-xl font-bold text-gray-900 mt-1">
                                                {metric.value}
                                            </p>
                                            <p
                                                className={`text-xs ${metric.improvement ? "text-green-600" : "text-red-600"} mt-1`}
                                            >
                                                {metric.change}
                                            </p>
                                        </div>
                                        <div
                                            className={`p-2 rounded-lg ${metric.improvement ? "bg-green-100" : "bg-red-100"}`}
                                        >
                                            {getIcon(metric.icon, `h-5 w-5 ${metric.improvement ? "text-green-600" : "text-red-600"}`)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - BMI Distribution & Recent Users */}
                    <div className="space-y-6">
                        {/* BMI Distribution */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    BMI Distribution
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {dashboardData.bmiDistribution && dashboardData.bmiDistribution.reduce((acc, curr) => acc + curr.count, 0)} Users
                                </span>
                            </div>
                            <div className="space-y-4">
                                {dashboardData.bmiDistribution && dashboardData.bmiDistribution.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {item.category}
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {item.count} users
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                                                <div
                                                    className={`h-2.5 rounded-full ${item.color}`}
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Total High-Risk Users
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {dashboardData.bmiDistribution && dashboardData.bmiDistribution
                                            .filter(item => item.category.includes('Obese Class II') || item.category.includes('Obese Class III'))
                                            .reduce((acc, curr) => acc + curr.count, 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Users */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Recent Users
                                </h2>
                                
                            </div>
                            <div className="space-y-4">
                                {dashboardData.recentUsers && dashboardData.recentUsers.map((user, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                                    user.risk === "Very High"
                                                        ? "bg-red-100"
                                                        : user.risk === "High"
                                                          ? "bg-orange-100"
                                                          : "bg-yellow-100"
                                                }`}
                                            >
                                                <span
                                                    className={`font-semibold ${
                                                        user.risk ===
                                                        "Very High"
                                                            ? "text-red-600"
                                                            : user.risk ===
                                                                "High"
                                                              ? "text-orange-600"
                                                              : "text-yellow-600"
                                                    }`}
                                                >
                                                    {user.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-medium">
                                                        BMI: {user.bmi}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-1.5 py-0.5 rounded ${
                                                            user.category && user.category.includes(
                                                                "Obese",
                                                            )
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                    >
                                                        {user.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500 block">
                                                {user.plan}
                                            </span>
                                            <span
                                                className={`text-xs font-medium mt-1 ${
                                                    user.risk === "Very High"
                                                        ? "text-red-600"
                                                        : user.risk === "High"
                                                          ? "text-orange-600"
                                                          : "text-yellow-600"
                                                }`}
                                            >
                                                {user.risk} Risk
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Safety & Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Safety Metrics */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="h-5 w-5 text-green-600" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Safety Metrics
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {dashboardData.safetyMetrics && dashboardData.safetyMetrics.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.metric}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            Target: {item.target}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.value}
                                        </span>
                                        <div
                                            className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${
                                                item.status === "good"
                                                    ? "bg-green-100 text-green-800"
                                                    : item.status === "warning"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {item.status === "good"
                                                ? "✓ On Target"
                                                : item.status === "warning"
                                                  ? "⚠️ Needs Attention"
                                                  : "✗ Below Target"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weight Loss Progress */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Weight Loss Progress
                            </h2>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Avg Monthly Loss
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {dashboardData.weightLossProgress?.avgMonthlyLoss} kg
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        ↑ 0.4 kg from last month
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Success Rate
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {dashboardData.weightLossProgress?.successRate}%
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        ↑ 5% from last quarter
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Total Weight Lost
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Across all users
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-green-600">
                                        {dashboardData.weightLossProgress?.totalWeightLost} kg
                                    </p>
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p>
                                        Equivalent to helping {dashboardData.weightLossProgress?.totalWeightLost ? Math.floor(parseInt(dashboardData.weightLossProgress.totalWeightLost.replace(',', '')) / 15) : 123} people reduce
                                        obesity-related health risks
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Exercise Categories */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Safe Exercise Categories
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {dashboardData.exerciseCategories && dashboardData.exerciseCategories.map((category, index) => {
                            const colorClasses = {
                                blue: 'from-blue-100 to-blue-50 border-blue-200 text-blue-800 text-blue-600',
                                green: 'from-green-100 to-green-50 border-green-200 text-green-800 text-green-600',
                                yellow: 'from-yellow-100 to-yellow-50 border-yellow-200 text-yellow-800 text-yellow-600',
                                purple: 'from-purple-100 to-purple-50 border-purple-200 text-purple-800 text-purple-600',
                            };
                            const colors = colorClasses[category.color] || colorClasses.blue;
                            
                            return (
                                <div key={index} className={`bg-gradient-to-r ${colors.split(' ')[0]} ${colors.split(' ')[1]} p-4 rounded-lg border ${colors.split(' ')[2]}`}>
                                    <div className="flex items-center gap-2">
                                        {getIcon(category.icon, `h-5 w-5 ${colors.split(' ')[4]}`)}
                                        <span className={`font-medium ${colors.split(' ')[3]}`}>
                                            {category.name}
                                        </span>
                                    </div>
                                    <p className={`text-xs ${colors.split(' ')[4]} mt-2`}>
                                        {category.count} active users
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {category.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;