import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import FitnessLayout from "@/Layouts/FitnessLayout";
import { FileVideo, X, CheckCircle, Activity, Scale } from "lucide-react";

export default function Dashboard({
    dbUser,
    dbStats,
    todayExercises,
    bmiHistory,
    workoutHistory,
}) {
    const [activeTab, setActiveTab] = useState("overview");
    const [historySubTab, setHistorySubTab] = useState("workouts");
    const [previewVideo, setPreviewVideo] = useState(null);
    const { post, processing } = useForm();

    const getEmbedUrl = (url) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
        }
        return url;
    };

    const handleMarkDone = (exercise) => {
        post(
            route("workout.log", {
                exercise_id: exercise.id,
                duration: parseInt(exercise.duration),
                calories: exercise.calories,
            }),
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <FitnessLayout>
            <Head title="Dashboard" />

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold">
                        Welcome, {dbUser.name}! 👋
                    </h1>
                    <p className="mt-2 opacity-90">
                        Plan:{" "}
                        <span className="font-semibold">
                            {dbUser.currentPlan}
                        </span>
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {dbStats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        >
                            <p className="text-gray-500 text-sm font-medium">
                                {stat.label}
                            </p>
                            <p className="text-3xl font-bold mt-1">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex space-x-6 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`pb-4 text-sm font-semibold ${activeTab === "overview" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                    >
                        Daily Routine
                    </button>
                    <button
                        onClick={() => setActiveTab("progress")}
                        className={`pb-4 text-sm font-semibold ${activeTab === "progress" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
                    >
                        History
                    </button>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center self-start">
                            <h2 className="text-gray-900 font-bold text-left mb-4">
                                Current BMI
                            </h2>
                            <div className="text-5xl font-black text-blue-600 mb-2">
                                {dbUser.bmi}
                            </div>
                            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">
                                {dbUser.bmiCategory}
                            </span>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-gray-900 font-bold mb-6">
                                Today's Session
                            </h2>
                            <div className="space-y-4">
                                {todayExercises.map((ex) => (
                                    <div
                                        key={ex.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border ${ex.is_completed ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-200"}`}
                                    >
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                            {ex.media_path ? (
                                                <button
                                                    onClick={() => setPreviewVideo(ex)}
                                                    className="w-full h-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition"
                                                >
                                                    <FileVideo size={20} className="text-gray-600" />
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-gray-400">No Video</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{ex.title}</h3>
                                            <p className="text-xs text-gray-500">
                                                {ex.duration} • {ex.calories} kcal
                                            </p>
                                        </div>
                                        <button
                                            disabled={processing || ex.is_completed}
                                            onClick={() => handleMarkDone(ex)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold ${ex.is_completed ? "bg-green-100 text-green-600" : "bg-green-600 text-white hover:bg-green-700"}`}
                                        >
                                            {ex.is_completed ? <CheckCircle size={16} /> : "Mark Done"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* PROGRESS TAB */}
                {activeTab === "progress" && (
                    <div className="space-y-6">
                        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                            <button
                                onClick={() => setHistorySubTab("workouts")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${historySubTab === "workouts" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                            >
                                <Activity size={16} /> Workouts
                            </button>
                            <button
                                onClick={() => setHistorySubTab("bmi")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${historySubTab === "bmi" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
                            >
                                <Scale size={16} /> Weight/BMI
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    {historySubTab === "workouts" ? (
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Exercise</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Calories</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Weight</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Weight</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">BMI</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {historySubTab === "workouts"
                                        ? workoutHistory.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {log.date} <span className="text-[10px] block opacity-50">{log.time}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.exercise_title}</td>
                                                <td className="px-6 py-4 text-sm text-green-600 font-bold">-{log.calories} kcal</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{log.weight} kg</td>
                                            </tr>
                                        ))
                                        : bmiHistory.map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(row.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.weight} kg</td>
                                                <td className="px-6 py-4 text-sm text-blue-600">{row.bmi_value}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">{row.bmi_category}</span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Video Preview Modal */}
            {previewVideo && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70] p-4 animate-in zoom-in duration-150">
                    <button
                        onClick={() => setPreviewVideo(null)}
                        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-all active:scale-90 z-[80]"
                    >
                        <X size={36} />
                    </button>

                    <div className="w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        {previewVideo.media_type === "youtube" || previewVideo.media_path.includes('youtube.com') || previewVideo.media_path.includes('youtu.be') ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={getEmbedUrl(previewVideo.media_path)}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                            <video
                                src={`/storage/${previewVideo.media_path}`}
                                className="w-full h-full"
                                controls
                                autoPlay
                            />
                        )}
                    </div>
                </div>
            )}
        </FitnessLayout>
    );
}