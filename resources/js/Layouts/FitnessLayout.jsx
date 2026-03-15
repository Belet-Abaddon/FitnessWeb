import React from "react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import GlobalChat from "@/Components/GlobalChat";

export default function FitnessLayout({ children }) {
    const { url, props } = usePage();
    // Safely access auth user. Fallback to empty object to prevent "cannot read property of null" errors
    const user = props.auth?.user || {};

    // Check if current route is part of authenticated area
    const isAuthenticatedRoute =
        url.startsWith("/dashboard") ||
        url.startsWith("/workouts") ||
        url.startsWith("/progress") ||
        url.startsWith("/chatbot") ||
        url.startsWith("/settings")||
        url.startsWith("/feedback")||
        url.startsWith("/profile");

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation Bar */}
            <nav
                className="bg-black shadow-lg border-b border-gray-800 sticky top-0 z-40"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <Link
                                href={isAuthenticatedRoute ? "/" : "/"}
                                className="flex items-center space-x-2"
                            >
                                <span className="text-2xl font-bold text-white">
                                    Stay
                                    <span className="text-green-500">FIT</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {isAuthenticatedRoute ? (
                                <>
                                    <NavLink href="/dashboard">Dashboard</NavLink>
                                    <NavLink href="/workouts">Workouts</NavLink>
                                    <NavLink href="/progress">Progress</NavLink>
                                    <NavLink href="/feedback">Feedback</NavLink>
                                    <button
                                        onClick={() =>
                                            window.dispatchEvent(new CustomEvent("open-chat"))
                                        }
                                        className="font-medium transition duration-150 text-base cursor-pointer text-gray-300 hover:text-green-500"
                                    >
                                        Chat
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</NavLink>
                                    <NavLink href="#features" onClick={(e) => scrollToSection(e, "features")}>Features</NavLink>
                                    <NavLink href="#how-it-works" onClick={(e) => scrollToSection(e, "how-it-works")}>How It Works</NavLink>
                                    <NavLink href="#about" onClick={(e) => scrollToSection(e, "about")}>About</NavLink>
                                    <NavLink href="#contact" onClick={(e) => scrollToSection(e, "contact")}>Contact</NavLink>
                                </>
                            )}
                        </div>

                        {/* Auth Buttons / User Menu */}
                        <div className="flex items-center space-x-4">
                            {user.id ? (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
                                        className="text-gray-400 hover:text-green-500 relative group"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full group-hover:animate-pulse"></span>
                                    </button>
                                    
                                    {/* Dynamic User Profile */}
                                    <Link href="/profile" className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold border-2 border-green-500 overflow-hidden">
                                            {user.profile_photo_url ? (
                                                <img src={user.profile_photo_url} alt={user.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span>{user.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <span className="hidden md:block text-sm font-medium text-white group-hover:text-green-500 transition duration-150">
                                            {user.name}
                                        </span>
                                    </Link>

                                    {/* Logout Link */}
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-gray-400 hover:text-red-500 text-sm font-medium transition"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-green-500 transition duration-150">
                                        Log in
                                    </Link>
                                    <Link href="/register" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
                                        Join Now
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden items-center">
                            <button className="text-gray-400 hover:text-green-500">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Global Chat - Only show if user is logged in */}
            {user.id && <GlobalChat />}

            {/* Footer - Hide on dashboard-related pages */}
            {!isAuthenticatedRoute && <Footer />}
        </div>
    );
}

// Sub-components (NavLink, Footer, etc.) remain as they are in your design
function NavLink({ href, onClick, children }) {
    const { url } = usePage();
    const isActive = url === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`font-medium transition duration-150 text-base cursor-pointer ${
                isActive ? "text-green-500" : "text-gray-300 hover:text-green-500"
            }`}
        >
            {children}
        </Link>
    );
}

function Footer() {
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-xl font-bold text-white">Stay<span className="text-green-500">FIT</span></span>
                        </div>
                        <p className="text-gray-400 mb-4">Your trusted partner in achieving health goals.</p>
                        <div className="flex space-x-4">
                            <SocialIcon href="#" icon="facebook" />
                            <SocialIcon href="#" icon="twitter" />
                            <SocialIcon href="#" icon="instagram" />
                            <SocialIcon href="#" icon="youtube" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-green-500 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <FooterLink href="#home" onClick={(e) => scrollToSection(e, "home")}>Home</FooterLink>
                            <FooterLink href="#features" onClick={(e) => scrollToSection(e, "features")}>Features</FooterLink>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-green-500 mb-4">Support</h3>
                        <ul className="space-y-2">
                            <FooterLink href="/contact">Contact Us</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} FitLife. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, onClick, children }) {
    return (
        <li>
            <Link href={href} onClick={onClick} className="text-gray-400 hover:text-green-500 transition duration-150 cursor-pointer">
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ href, icon }) {
    const icons = {
        facebook: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
        twitter: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
        instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
        youtube: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    };

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition duration-150">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d={icons[icon]} />
            </svg>
        </a>
    );
}