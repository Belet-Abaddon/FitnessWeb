import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FitnessLayout from '@/Layouts/FitnessLayout';

export default function Welcome() {
    return (
        <FitnessLayout>
            <Head title="Welcome - Stay Fit" />

            {/* Home Section */}
            <section id="home" className="relative bg-gradient-to-r from-blue-700 to-green-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Your Journey to a<br />Healthier Weight Starts Here
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
                            Personalized exercise plans, AI-driven nutritional guidance, and a smart chatbot 
                            to keep you motivated and informed every step of the way.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-150 shadow-lg hover:shadow-xl"
                            >
                                Start Your Journey
                            </Link>
                            <a
                                href="#features"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition duration-150 cursor-pointer"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="fill-current text-white" viewBox="0 0 1440 120">
                        <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Smart Fitness Support for Real Results
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Specially designed for overweight individuals, our RAG-enabled AI platform provides:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🤖"
                            title="AI-Powered RAG Chatbot"
                            description="Interact with a smart assistant that retrieves verified fitness data to give you accurate nutritional advice and exercise tips."
                            color="blue"
                        />
                        <FeatureCard
                            icon="📊"
                            title="Instant BMI Analysis"
                            description="Get your BMI category instantly upon registration and track your weight changes with our intuitive progress dashboard."
                            color="green"
                        />
                        <FeatureCard
                            icon="🏋️"
                            title="Adaptive Exercise Plans"
                            description="Access workout routines specifically tailored to your BMI category, ensuring safety and gradual intensity progression."
                            color="blue"
                        />
                        <FeatureCard
                            icon="🥗"
                            title="Intelligent Nutrition"
                            description="Receive science-based meal suggestions and nutritional knowledge retrieved directly from our verified health database."
                            color="green"
                        />
                        <FeatureCard
                            icon="📺"
                            title="Visual Meal Guides"
                            description="Access a curated collection of video tutorials for healthy meal prep, specifically chosen for your weight goals."
                            color="blue"
                        />
                        <FeatureCard
                            icon="⏰"
                            title="Smart Reminders"
                            description="Stay consistent with automated workout reminders and daily motivational emails sent directly to your inbox."
                            color="green"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How Stay Fit Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Your science-based weight management journey in four simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard
                            number="1"
                            title="Quick Assessment"
                            description="Enter your profile details to receive an instant BMI calculation and health classification."
                        />
                        <StepCard
                            number="2"
                            title="Receive Your Plan"
                            description="Our AI engine generates safe, low-impact exercise routines based on your physical metrics."
                        />
                        <StepCard
                            number="3"
                            title="Engage with AI"
                            description="Ask our RAG-based chatbot anything about fitness and get context-aware, verified information."
                        />
                        <StepCard
                            number="4"
                            title="Track & Improve"
                            description="Monitor your weight logs, get email reminders, and reach your goals with consistent tracking."
                        />
                    </div>

                    {/* Chatbot Preview */}
                    <div className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-black text-white px-6 py-4 flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="ml-2 text-sm font-medium">Stay Fit AI Assistant</span>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                                        <p className="text-gray-800">Hi! I'm your AI fitness coach. I can help you with exercises or nutrition tips. What's on your mind?</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                                        <p className="text-white">Is it safe to do cardio if I have a high BMI?</p>
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                                        <p className="text-gray-800">According to our health database, low-impact cardio like brisk walking or swimming is safe and effective. I recommend starting with 15-20 minutes a day. Should I add a walking plan to your schedule?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                About Stay Fit
                            </h2>
                            <p className="text-lg text-gray-600 mb-4">
                                Managing weight isn't just about hard work; it's about the right information and consistent support. For those in the overweight or obese category, generic plans can sometimes be unsafe or overwhelming.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                **Stay Fit** bridges this gap using advanced AI. Our platform combines a **Retrieval-Augmented Generation (RAG)** chatbot with structured fitness plans to give you guidance that is both personalized and scientifically grounded. From automated email motivation to detailed progress tracking, we ensure you have every tool needed to succeed.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-3xl font-bold text-blue-600">Dual</div>
                                    <div className="text-gray-600">Database Logic</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">RAG</div>
                                    <div className="text-gray-600">AI Support</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-3xl font-bold text-blue-600">Groq</div>
                                    <div className="text-gray-600">Fast Inference</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">24/7</div>
                                    <div className="text-gray-600">Smart Coaching</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                alt="About Stay Fit"
                                className="rounded-lg shadow-xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold">2026</div>
                                <div className="text-sm">Final Year Project</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Have questions about your weight management journey or our AI-driven approach? 
                            We're here to provide the support you need.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300 border border-gray-100">
                                <div className="text-4xl mb-4">✉️</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                                <p className="text-gray-600 mb-4">For general inquiries and technical support.</p>
                                <a href="mailto:support@stayfit.ai" className="text-blue-600 font-semibold hover:underline">
                                    support@stayfit.ai
                                </a>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300 border border-gray-100">
                                <div className="text-4xl mb-4">🤖</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Assistant</h3>
                                <p className="text-gray-600 mb-4">Our RAG-based chatbot is available 24/7 for instant guidance.</p>
                                <Link href="/login" className="text-green-600 font-semibold hover:underline">
                                    Start Chatting Now
                                </Link>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300 border border-gray-100">
                                <div className="text-4xl mb-4">📍</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Development Hub</h3>
                                <p className="text-gray-600 mb-4">Final Year AI Project Research & Implementation.</p>
                                <span className="text-gray-500 italic">Yangon, Myanmar</span>
                            </div>
                        </div>

                        {/* Social/Community Engagement - Optional */}
                        <div className="mt-16 text-center">
                            <p className="text-gray-500 mb-6 font-medium uppercase tracking-widest text-sm">Follow our progress</p>
                            <div className="flex justify-center space-x-8">
                                <a href="#" className="text-gray-400 hover:text-blue-600 transition duration-150 text-2xl">GitHub</a>
                                <a href="#" className="text-gray-400 hover:text-red-600 transition duration-150 text-2xl">YouTube</a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-150 text-2xl">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-700 to-green-700">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Experience Intelligent Fitness?
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                        Join Stay Fit today and see how RAG AI can personalize your weight loss journey.
                    </p>
                    <Link
                        href="/register"
                        className="inline-block px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-150 shadow-lg hover:shadow-xl"
                    >
                        Create Your Free Account
                    </Link>
                </div>
            </section>
        </FitnessLayout>
    );
}

// Feature Card Component
function FeatureCard({ icon, title, description, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-100 hover:border-blue-300',
        green: 'bg-green-50 border-green-100 hover:border-green-300'
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border ${colorClasses[color]}`}>
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

// Step Card Component
function StepCard({ number, title, description }) {
    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {number}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

// Contact Info Component
function ContactInfo({ icon, title, content }) {
    return (
        <div className="flex items-start space-x-4">
            <div className="text-2xl">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600">{content}</p>
            </div>
        </div>
    );
}