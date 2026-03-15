import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Trash2, Plus, Clock, ArrowLeft, AlertCircle } from "lucide-react";

export default function ManageExercises({ plan, allExercises, assignedExercises }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        exercise_id: "",
        duration_minutes: "",
        day_number: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("plan-exercises.store", plan.id), {
            onSuccess: () => reset("exercise_id", "duration_minutes"),
        });
    };

    const removeExercise = (pivotId) => {
        if (confirm("Remove this exercise from the plan?")) {
            router.delete(route("plan-exercises.destroy", [plan.id, pivotId]));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Manage - ${plan.name}`} />

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <button 
                    onClick={() => window.history.back()}
                    className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Plans
                </button>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-black text-gray-900">{plan.name}</h1>
                    <p className="text-gray-500">Manage daily exercise assignments</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <form onSubmit={submit} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 sticky top-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Plus className="text-blue-600" size={20} /> Add Exercise
                            </h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Exercise</label>
                                <select 
                                    className={`w-full mt-1 rounded-xl border-gray-200 ${errors.exercise_id ? 'border-red-500' : ''}`}
                                    value={data.exercise_id}
                                    onChange={e => setData('exercise_id', e.target.value)}
                                    required
                                >
                                    <option value="">Choose...</option>
                                    {allExercises.map(ex => (
                                        <option key={ex.id} value={ex.id}>{ex.title}</option>
                                    ))}
                                </select>
                                {errors.exercise_id && <div className="text-red-500 text-xs mt-1">{errors.exercise_id}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Day Number</label>
                                    <input 
                                        type="number" 
                                        className="w-full mt-1 rounded-xl border-gray-200"
                                        value={data.day_number}
                                        onChange={e => setData('day_number', e.target.value)}
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mins</label>
                                    <input 
                                        type="number" 
                                        className="w-full mt-1 rounded-xl border-gray-200"
                                        value={data.duration_minutes}
                                        onChange={e => setData('duration_minutes', e.target.value)}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={processing}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                            >
                                {processing ? "Adding..." : "Add to Schedule"}
                            </button>
                        </form>
                    </div>

                    {/* Schedule Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-bold text-xl text-gray-800">Current Schedule</h3>
                        
                        {assignedExercises.length === 0 ? (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center text-gray-400">
                                No exercises assigned yet.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {assignedExercises.map((ex) => (
                                    <div key={ex.pivot.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
                                                D{ex.pivot.day_number}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{ex.title}</h4>
                                                <div className="flex gap-4 text-xs text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1"><Clock size={14}/> {ex.pivot.duration_minutes} mins</span>
                                                    <span className="flex items-center gap-1 text-orange-600"><Plus size={14}/> MET: {ex.met_value}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeExercise(ex.pivot.id)}
                                            className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}