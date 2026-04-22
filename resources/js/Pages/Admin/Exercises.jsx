import React, { useState, useEffect, useCallback } from "react";
import { useForm, router, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Dumbbell,
    Search,
    Plus,
    Edit,
    Trash2,
    FileVideo,
    Youtube,
    X,
    Activity,
} from "lucide-react";
import { debounce } from "lodash";

const ExerciseManagement = ({ exercises, filters, stats }) => {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [previewVideo, setPreviewVideo] = useState(null);

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        title: "",
        description: "",
        met_value: "",
        media_type: "file",
        media: null,
        youtube_url: "",
    });

    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11
            ? `https://www.youtube.com/embed/${match[2]}`
            : url;
    };

    const updateFilters = useCallback(
        debounce((query) => {
            // Search လုပ်တဲ့အခါ page ကို 1 ကနေ ပြန်စစေချင်ရင် page: 1 ထည့်ပေးရပါတယ်
            router.get(
                route("exercises.index"),
                { search: query },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 300),
        [],
    );

    useEffect(() => {
        // ပထမဆုံး load တဲ့အချိန်မှာ search query မရှိရင် update မလုပ်အောင် တားထားတာပါ
        if (searchQuery !== (filters.search || "")) {
            updateFilters(searchQuery);
        }
    }, [searchQuery]);

    const openAddModal = () => {
        setEditData(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (exercise) => {
        setEditData(exercise);
        setData({
            title: exercise.title,
            description: exercise.description,
            met_value: exercise.met_value,
            media_type: exercise.media_type || "file",
            media: null,
            youtube_url:
                exercise.media_type === "youtube" ? exercise.media_path : "",
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        };

        if (editData) {
            post(route("exercises.update", editData.id), options);
        } else {
            post(route("exercises.store"), options);
        }
    };

    const handleDelete = (exercise) => {
        if (confirm("Are you sure you want to delete this exercise?")) {
            destroy(route("exercises.destroy", exercise.id));
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Exercise Library
                    </h1>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Plus size={18} /> Add Exercise
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                        title="Total Exercises"
                        value={stats.total}
                        icon={<Dumbbell />}
                        color="blue"
                    />
                    <StatCard
                        title="Avg. Intensity (MET)"
                        value={stats.avgMet}
                        icon={<Activity />}
                        color="orange"
                    />
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search exercises by title..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b text-gray-600 text-sm">
                                <tr>
                                    <th className="p-4 font-semibold uppercase tracking-wider">
                                        Exercise Details
                                    </th>
                                    <th className="p-4 font-semibold uppercase tracking-wider">
                                        Media
                                    </th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-center">
                                        MET Value
                                    </th>
                                    <th className="p-4 text-right font-semibold uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {exercises.data.length > 0 ? (
                                    exercises.data.map((exercise) => (
                                        <tr
                                            key={exercise.id}
                                            className="hover:bg-gray-50/50 transition"
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">
                                                    {exercise.title}
                                                </div>
                                                <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                    {exercise.description}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {exercise.media_path ? (
                                                    <div
                                                        onClick={() =>
                                                            setPreviewVideo(exercise)
                                                        }
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg cursor-pointer transition"
                                                    >
                                                        {exercise.media_type ===
                                                        "youtube" ? (
                                                            <Youtube
                                                                size={16}
                                                                className="text-red-500"
                                                            />
                                                        ) : (
                                                            <FileVideo size={16} />
                                                        )}
                                                        <span className="text-xs font-medium">
                                                            Preview
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">
                                                        No Media
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                    {exercise.met_value}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(exercise)
                                                        }
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(exercise)
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-gray-400">
                                            No exercises found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{exercises.from || 0}</span> to <span className="font-semibold">{exercises.to || 0}</span> of <span className="font-semibold">{exercises.total}</span> entries
                        </div>
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            {exercises.links.map((link, index) => {
                                // link.label မှာ ရှေ့နောက် symbol တွေပါနေရင် link.url ကိုပဲ သုံးပြီး သွားခိုင်းတာက ပိုစိတ်ချရပါတယ်
                                return (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        // preserveState ကို false ထားကြည့်ပါ သို့မဟုတ် မသုံးဘဲ ထားပါ
                                        // ဒါမှ page refresh ဖြစ်သလို data အသစ်ကို သေချာဆွဲမှာပါ
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                            link.active 
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                                            : !link.url 
                                            ? "text-gray-300 cursor-not-allowed" 
                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl space-y-5"
                    >
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editData ? "Update" : "Create"} Exercise
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                    Title
                                </label>
                                <input
                                    className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="Push Up"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                    MET Value (Intensity)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={data.met_value}
                                    onChange={(e) =>
                                        setData("met_value", e.target.value)
                                    }
                                    placeholder="3.5"
                                />
                                {errors.met_value && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">
                                        {errors.met_value}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                    Media Source
                                </label>
                                <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("media_type", "file")
                                        }
                                        className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition ${data.media_type === "file" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
                                    >
                                        <FileVideo
                                            size={14}
                                            className="mr-1.5"
                                        />{" "}
                                        Local File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("media_type", "youtube")
                                        }
                                        className={`flex items-center justify-center py-2 rounded-lg text-xs font-bold transition ${data.media_type === "youtube" ? "bg-white shadow-sm text-red-600" : "text-gray-500"}`}
                                    >
                                        <Youtube size={14} className="mr-1.5" />{" "}
                                        YouTube Link
                                    </button>
                                </div>
                            </div>

                            {data.media_type === "file" ? (
                                <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center bg-gray-50/50 hover:bg-gray-100/50 transition relative">
                                    <input
                                        type="file"
                                        id="video"
                                        hidden
                                        onChange={(e) =>
                                            setData("media", e.target.files[0])
                                        }
                                        accept="video/*"
                                    />
                                    <label
                                        htmlFor="video"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <FileVideo
                                            className="text-blue-500 mb-2"
                                            size={24}
                                        />
                                        <span className="text-xs font-semibold text-gray-600">
                                            {data.media
                                                ? data.media.name
                                                : "Click to upload video"}
                                        </span>
                                    </label>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <input
                                        className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-red-500 outline-none transition"
                                        value={data.youtube_url}
                                        onChange={(e) =>
                                            setData(
                                                "youtube_url",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Paste YouTube link here..."
                                    />
                                    {errors.youtube_url && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {errors.youtube_url}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full border border-gray-200 rounded-xl p-2.5 h-24 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="How to perform this exercise..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={processing}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {processing ? "Saving..." : "Save Exercise"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Video Preview Modal */}
            {previewVideo && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60] p-4 animate-in zoom-in duration-150">
                    <button
                        onClick={() => setPreviewVideo(null)}
                        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-all active:scale-90"
                    >
                        <X size={36} />
                    </button>

                    <div className="w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        {previewVideo.media_type === "youtube" ? (
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
        </AdminLayout>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {title}
            </p>
            <h3 className="text-2xl font-black text-gray-800">{value}</h3>
        </div>
    </div>
);

export default ExerciseManagement;