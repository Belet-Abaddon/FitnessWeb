import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import FitnessLayout from "@/Layouts/FitnessLayout";
import { Star, Send, MessageSquare, CheckCircle, Clock, Trash2 } from "lucide-react";

export default function Feedback({ previousFeedback }) {
    const { data, setData, post, processing, reset, errors, delete: destroy } = useForm({
        rating: 5,
        comment: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("user.feedback.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
                setTimeout(() => setSubmitted(false), 5000);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this feedback?")) {
            destroy(route("feedback.destroy", id)); // Using the shared destroy route
        }
    };

    return (
        <FitnessLayout>
            <Head title="Feedback" />
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold">Feedback 👋</h1>
                    <p className="mt-2 opacity-90">How is your fitness journey going?</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Feedback Form Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
                                <MessageSquare className="text-blue-600" size={20} /> 
                                Write a Review
                            </h2>

                            {submitted ? (
                                <div className="bg-green-50 border border-green-100 p-6 rounded-xl text-center">
                                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                                    <h3 className="text-green-800 font-bold">Thank You!</h3>
                                    <p className="text-green-600 text-sm">Your feedback helps us make the app better.</p>
                                    <button onClick={() => setSubmitted(false)} className="mt-4 text-blue-600 font-bold text-sm hover:underline">
                                        Send another response
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Star Rating */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Rate your current plan</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setData("rating", star)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <Star 
                                                        size={32} 
                                                        className={data.rating >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                        <textarea
                                            value={data.comment}
                                            onChange={(e) => setData("comment", e.target.value)}
                                            rows="4"
                                            className="w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            placeholder="Tell us what you think about the exercises..."
                                        ></textarea>
                                        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        <Send size={18} /> {processing ? "Sending..." : "Submit Feedback"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* History Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-gray-900 font-bold mb-4">Your History</h2>
                            <div className="space-y-4">
                                {previousFeedback.length > 0 ? (
                                    previousFeedback.map((f) => (
                                        <div key={f.id} className="border-b border-gray-50 pb-4 last:border-0 group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < f.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                                <button 
                                                    onClick={() => handleDelete(f.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-2 italic font-medium">"{f.comment}"</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">
                                                    {new Date(f.created_at).toLocaleDateString()}
                                                </span>
                                                
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-xs text-gray-400 font-medium italic">You haven't sent any feedback yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </FitnessLayout>
    );
}