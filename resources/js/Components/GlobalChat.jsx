import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function GlobalChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "welcome-1",
            type: "bot",
            message:
                "Hello! I'm your FitLife assistant. How can I help you today?",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [unreadCount, setUnreadCount] = useState(1);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isTyping]);

    // Fetch Chat History
    useEffect(() => {
        let isMounted = true;

        const fetchHistory = async () => {
            try {
                const response = await axios.get("/chat-history");
                console.log("History Data:", response.data); // Console မှာ data ကျမကျ အရင်ကြည့်ပါ

                if (response.data && response.data.length > 0) {
                    const formattedMessages = response.data.flatMap((chat) => [
                        {
                            id: `u-${chat.id}`,
                            type: "user",
                            message: chat.message,
                            
                            time: chat.created_at
                                ? new Date(chat.created_at).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" },
                                    )
                                : "N/A",
                        },
                        {
                            id: `b-${chat.id}`,
                            type: "bot",
                            message: chat.reply,
                            time: chat.created_at
                                ? new Date(chat.created_at).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" },
                                    )
                                : "N/A",
                        },
                    ]);
                    setMessages((prev) => [prev[0], ...formattedMessages]);
                }
            } catch (error) {
                console.error("Fetch Error Detail:", error.response);
            }
        };

        if (isOpen) {
            fetchHistory();
        }

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setUnreadCount(0);
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const textToSend = inputMessage.trim();
        if (!textToSend) return;

        const userMessage = {
            id: Date.now(),
            type: "user",
            message: textToSend,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setIsTyping(true);

        try {
            const response = await axios.post("/chatbot", {
                message: textToSend,
            });

            console.log("Full Response:", response.data);

            if (response.data && response.data.reply) {
                const botMessage = {
                    id: `bot-${Date.now()}`,
                    type: "bot",
                    message: response.data.reply,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch (error) {
            console.error("Connection Error:", error);
        }
    };

    return (
        <>
            {/* Chat Button Code remains the same */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-4 rounded-full shadow-lg z-50"
            >
                {isOpen ? "✕" : "💬"}
                {!isOpen && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 flex flex-col"
                    style={{ height: "500px" }}
                >
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-sm">
                                StayFit Assistant
                            </h3>
                            <p className="text-[10px] text-blue-100 italic">
                                Context-Aware AI Coach
                            </p>
                        </div>
                        <button onClick={toggleChat}>✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] ${msg.type === "user" ? "bg-blue-600 text-white rounded-l-lg rounded-tr-lg" : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-r-lg rounded-tl-lg"} p-3`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                    <p
                                        className={`text-[10px] mt-1 ${msg.type === "user" ? "text-blue-100" : "text-gray-400"}`}
                                    >
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="text-xs text-gray-400 italic">
                                Coach is typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSendMessage}
                        className="p-4 border-t border-gray-100 flex gap-2"
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask about your workout or BMI..."
                            className="flex-1 px-4 py-2 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-600 text-white rounded-full"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
