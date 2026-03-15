import React, { useState, useEffect, useCallback } from "react";
import { useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Dumbbell,
    Search,
    Plus,
    Edit,
    Trash2,
    FileVideo,
    X,
    Activity,
} from "lucide-react";
import { debounce } from "lodash";

const ExerciseManagement = ({ exercises, filters, stats }) => {
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [previewVideo, setPreviewVideo] = useState(null);

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        title: "",
        description: "",
        met_value: "",
        media: null,
    });

    // Filtering Logic
    const updateFilters = useCallback(
        debounce((query) => {
            router.get(route("exercises.index"), { search: query }, {
                preserveState: true,
                replace: true,
            });
        }, 300),
        []
    );

    useEffect(() => {
        updateFilters(searchQuery);
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
            media: null,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editData) {
            post(route("exercises.update", editData.id), {
                forceFormData: true,
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route("exercises.store"), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (exercise) => {
        if (confirm("Are you sure you want to delete this exercise?")) {
            destroy(route("exercises.destroy", exercise.id));
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Exercise Library</h1>
                    <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                        <Plus size={18} /> Add Exercise
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard title="Total Exercises" value={stats.total} icon={<Dumbbell />} color="blue" />
                    <StatCard title="Avg. Intensity (MET)" value={stats.avgMet} icon={<Activity />} color="orange" />
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search exercises by title..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b text-gray-600 text-sm">
                            <tr>
                                <th className="p-4 font-semibold">Exercise Details</th>
                                <th className="p-4 font-semibold">Video</th>
                                <th className="p-4 font-semibold">MET Value</th>
                                <th className="p-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {exercises.data.map((exercise) => (
                                <tr key={exercise.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{exercise.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{exercise.description}</div>
                                    </td>
                                    <td className="p-4">
                                        {exercise.media_path ? (
                                            <div onClick={() => setPreviewVideo(exercise)} className="w-20 h-12 bg-black rounded flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                                <FileVideo size={16} className="text-white" />
                                            </div>
                                        ) : <span className="text-gray-400 text-xs italic">No Video</span>}
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-bold">
                                            {exercise.met_value}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(exercise)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(exercise)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">{editData ? "Update" : "Create"} Exercise</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={data.title} onChange={(e) => setData("title", e.target.value)} />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">MET Value (Intensity)</label>
                                <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={data.met_value} onChange={(e) => setData("met_value", e.target.value)} />
                                {errors.met_value && <p className="text-red-500 text-xs mt-1">{errors.met_value}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <textarea className="w-full border border-gray-300 rounded-lg p-2 h-24 outline-none" 
                                    value={data.description} onChange={(e) => setData("description", e.target.value)} />
                            </div>
                            <div className="border-2 border-dashed p-4 rounded-lg text-center">
                                <input type="file" id="video" hidden onChange={(e) => setData("media", e.target.files[0])} />
                                <label htmlFor="video" className="cursor-pointer text-sm text-blue-600">{data.media ? data.media.name : "Upload Exercise Video"}</label>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button disabled={processing} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50">
                                {processing ? "Saving..." : "Save Exercise"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Video Modal */}
            {previewVideo && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4">
                    <button onClick={() => setPreviewVideo(null)} className="absolute top-6 right-6 text-white"><X size={32} /></button>
                    <div className="w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
                        <video src={`/storage/${previewVideo.media_path}`} className="w-full h-full" controls autoPlay />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </div>
);

export default ExerciseManagement;