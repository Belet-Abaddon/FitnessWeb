import React, { useState, useEffect } from 'react';

export default function GlobalChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            type: 'bot', 
            message: 'Hello! I\'m your FitLife assistant. How can I help you today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(1);

    // User data (would come from props/context)
    const user = {
        name: 'John Doe',
        bmi: 27.8,
        currentPlan: 'Beginner Weight Loss Plan'
    };

    // Handle opening/closing chat
    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
        }
    };

    // Listen for custom event to open chat from navbar
    useEffect(() => {
        const handleOpenChat = () => {
            setIsOpen(true);
            setUnreadCount(0);
        };
        
        window.addEventListener('open-chat', handleOpenChat);
        
        return () => {
            window.removeEventListener('open-chat', handleOpenChat);
        };
    }, []);

    // Handle sending message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            message: inputMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([...messages, userMessage]);
        setInputMessage('');

        // Simulate bot typing
        setTimeout(() => {
            const botResponse = getBotResponse(inputMessage);
            const botMessage = {
                id: messages.length + 2,
                type: 'bot',
                message: botResponse,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    // Simple rule-based responses
    const getBotResponse = (input) => {
        const inputLower = input.toLowerCase();
        
        if (inputLower.includes('workout') || inputLower.includes('exercise')) {
            return `Based on your current plan (${user.currentPlan}), I recommend sticking to your scheduled workouts. Today is a great day for some low-impact cardio! 💪`;
        }
        else if (inputLower.includes('diet') || inputLower.includes('meal') || inputLower.includes('eat') || inputLower.includes('food')) {
            return "For healthy weight loss, focus on lean proteins, vegetables, and whole grains. Would you like a sample meal plan?";
        }
        else if (inputLower.includes('bmi') || inputLower.includes('weight')) {
            return `Your current BMI is ${user.bmi}. You're making great progress! Keep up the consistency.`;
        }
        else if (inputLower.includes('motivation') || inputLower.includes('tired') || inputLower.includes('hard')) {
            return "Remember why you started! Every small step counts. You've already made amazing progress! 🌟";
        }
        else if (inputLower.includes('plan') || inputLower.includes('progress')) {
            return `You're on Week 3 of your ${user.currentPlan}. You've completed 24 workouts and lost 10kg so far!`;
        }
        else if (inputLower.includes('hello') || inputLower.includes('hi')) {
            return `Hi ${user.name}! How can I help you with your fitness journey today?`;
        }
        else if (inputLower.includes('thank')) {
            return "You're welcome! I'm here to help anytime. 😊";
        }
        else {
            return "I'm here to help with workouts, nutrition, motivation, or tracking your progress. What would you like to know?";
        }
    };

    // Quick suggestion buttons
    const suggestions = [
        "Today's workout",
        "Meal ideas",
        "Check my progress",
        "Motivation"
    ];

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 z-50 group"
            >
                {isOpen ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 flex flex-col" style={{ height: '500px' }}>
                    
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-400 rounded-full absolute -bottom-1 -right-1 border-2 border-white"></div>
                                <svg className="h-8 w-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">FitLife Assistant</h3>
                                <p className="text-xs text-blue-100">Online • Here to help</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleChat}
                            className="text-white hover:text-gray-200 transition duration-150"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.type === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center text-white text-sm mr-2 flex-shrink-0">
                                        AI
                                    </div>
                                )}
                                <div className={`max-w-xs ${msg.type === 'user' ? 'order-1' : 'order-2'}`}>
                                    <div
                                        className={`rounded-lg p-3 ${
                                            msg.type === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                    >
                                        <p className="text-sm">{msg.message}</p>
                                    </div>
                                    <p className={`text-xs text-gray-400 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                                {msg.type === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm ml-2 flex-shrink-0">
                                        <img 
                                            src="https://randomuser.me/api/portraits/men/1.jpg" 
                                            alt="You"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Typing indicator */}
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center text-white text-sm mr-2">
                                AI
                            </div>
                            <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-4 py-2 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition duration-150"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition duration-150 shadow-md"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}