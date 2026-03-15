import React from 'react';
import { Head, Link } from '@inertiajs/react';
import FitnessLayout from '@/Layouts/FitnessLayout';

export default function Welcome() {
    return (
        <FitnessLayout>
            <Head title="Welcome - FitLife" />

            {/* Home Section */}
            <section id="home" className="relative bg-gradient-to-r from-blue-700 to-green-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Your Journey to a<br />Healthier Weight Starts Here
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
                            Personalized exercise plans, balanced nutrition guidance, and a rule-based chatbot 
                            to keep you motivated every step of the way.
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
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Specially designed for individuals who are overweight or obese, our platform provides:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="🤖"
                            title="Rule-Based Chatbot"
                            description="Get personalized exercise and diet recommendations, motivational messages, and workout reminders to help you stay consistent and confident."
                            color="blue"
                        />
                        <FeatureCard
                            icon="📊"
                            title="BMI Calculator"
                            description="Accurately calculate your BMI and track your progress over time with our easy-to-use calculator."
                            color="green"
                        />
                        <FeatureCard
                            icon="🏋️"
                            title="Safe Exercise Plans"
                            description="Follow workout plans specifically designed for overweight individuals, focusing on safety and gradual progression."
                            color="blue"
                        />
                        <FeatureCard
                            icon="🥗"
                            title="Personalized Diet Plans"
                            description="Receive balanced meal recommendations tailored to your goals and dietary preferences."
                            color="green"
                        />
                        <FeatureCard
                            icon="📺"
                            title="YouTube Meal Guides"
                            description="Access curated YouTube links for healthy meal preparation tutorials and nutrition tips."
                            color="blue"
                        />
                        <FeatureCard
                            icon="⏰"
                            title="Workout Reminders"
                            description="Never miss a workout with our reminder system that keeps you accountable and on track."
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
                            How FitLife Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Your personalized weight management journey in four simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard
                            number="1"
                            title="Calculate Your BMI"
                            description="Start by entering your height and weight to get your BMI and personalized recommendations."
                        />
                        <StepCard
                            number="2"
                            title="Get Personalized Plans"
                            description="Our system generates safe exercise routines and diet plans based on your BMI and goals."
                        />
                        <StepCard
                            number="3"
                            title="Chat with Our Bot"
                            description="Interact with our rule-based chatbot for daily motivation, tips, and workout reminders."
                        />
                        <StepCard
                            number="4"
                            title="Track & Stay Consistent"
                            description="Monitor your progress, watch healthy meal tutorials, and stay motivated with daily reminders."
                        />
                    </div>

                    {/* Chatbot Preview */}
                    <div className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="bg-black text-white px-6 py-4 flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="ml-2 text-sm font-medium">FitLife Assistant</span>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                                        <p className="text-gray-800">Hi! I'm your fitness assistant. How can I help you today?</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                                        <p className="text-white">What exercise is safe for beginners?</p>
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                                        <p className="text-gray-800">Great question! I recommend starting with low-impact exercises like walking, swimming, or seated exercises. Would you like me to suggest a beginner-friendly workout plan?</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                                        <p className="text-white">Yes, please!</p>
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
                                About FitLife
                            </h2>
                            <p className="text-lg text-gray-600 mb-4">
                                Maintaining a healthy weight can be challenging, especially for people who are overweight or obese. Many struggle to follow safe exercises, effectively track their progress, or consume balanced meals.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                That's why we created FitLife - a comprehensive fitness website featuring a rule-based chatbot designed specifically for users who are overweight or have obesity. Our platform provides personalized exercise and diet recommendations, safe workout plans, and curated YouTube links for healthy meals. The chatbot sends motivational messages and workout reminders to help users stay consistent and confident throughout their journey.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-3xl font-bold text-blue-600">5K+</div>
                                    <div className="text-gray-600">Active Users</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">85%</div>
                                    <div className="text-gray-600">Success Rate</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-3xl font-bold text-blue-600">100+</div>
                                    <div className="text-gray-600">Meal Videos</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">24/7</div>
                                    <div className="text-gray-600">Chatbot Support</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                alt="About FitLife"
                                className="rounded-lg shadow-xl"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold">2024</div>
                                <div className="text-sm">Launch Year</div>
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
                        <p className="text-xl text-gray-600">
                            Have questions about your weight management journey? We're here to help!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tell us about your goals or questions..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-150 shadow-md hover:shadow-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                        <div className="space-y-8">
                            <ContactInfo
                                icon="📍"
                                title="Visit Us"
                                content="123 Wellness Street, Healthy City, HC 12345"
                            />
                            <ContactInfo
                                icon="📞"
                                title="Call Us"
                                content="+1 (555) 123-4567"
                            />
                            <ContactInfo
                                icon="✉️"
                                title="Email Us"
                                content="support@fitlife.com"
                            />
                            <ContactInfo
                                icon="🕒"
                                title="Chatbot Available"
                                content="24/7 - Always here to help and motivate you!"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-700 to-green-700">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Health?
                    </h2>
                    <p className="text-xl text-gray-200 mb-8">
                        Join FitLife today and get personalized support for your weight management journey.
                    </p>
                    <Link
                        href="/register"
                        className="inline-block px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-150 shadow-lg hover:shadow-xl"
                    >
                        Start Your Free Trial
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