import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    MessageSquare,
    FileText,
    BarChart3,
    ClipboardList,
    LogOut,
    Menu,
    X,
    HeartPulse,
} from "lucide-react";

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Use the actual auth data from Inertia props
    const { auth } = usePage().props;
    // Get current URL to highlight active navigation
    const { url } = usePage();

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Exercise Plans", href: "/exercise-plans", icon: Dumbbell },
        { name: "Exercises", href: "/admin/exercises", icon: ClipboardList },
        { name: "User Plans", href: "/admin/user-plans", icon: FileText },
        { name: "BMI Records", href: "/admin/bmi-records", icon: BarChart3 },
        // { name: "Chatbot Rules", href: "/admin/chatbot-rules", icon: MessageSquare },
        { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            <div className={`lg:hidden ${sidebarOpen ? "fixed inset-0 z-40" : "hidden"}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex w-64 z-50">
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button onClick={() => setSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <SidebarContent navigation={navigation} auth={auth} currentUrl={url} />
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <SidebarContent navigation={navigation} auth={auth} currentUrl={url} />
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button onClick={() => setSidebarOpen(true)} className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-gray-800">Fitness Admin Dashboard</h1>
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-gray-700">{auth.user.name}</div>
                                <div className="text-xs text-gray-500 capitalize">{auth.user.role || 'Administrator'}</div>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
};

const SidebarContent = ({ navigation, auth, currentUrl }) => (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
                <HeartPulse className="h-8 w-8 text-indigo-400" />
                <span className="ml-3 text-white text-xl font-bold tracking-tight">StayFit Admin</span>
            </div>

            <nav className="flex-1 space-y-1 px-3">
                {navigation.map((item) => {
                    const isActive = currentUrl.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isActive 
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                        >
                            <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>

        {/* Improved Logout Section */}
        <div className="flex-shrink-0 flex flex-col border-t border-gray-800 p-4 bg-gray-900/50">
            <Link
                href={route("logout")}
                method="post"
                as="button"
                className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors group"
            >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-400" />
                Logout
            </Link>
        </div>
    </div>
);

export default AdminLayout;