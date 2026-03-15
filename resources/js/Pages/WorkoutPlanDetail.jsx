import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import FitnessLayout from '@/Layouts/FitnessLayout';

export default function WorkoutPlanDetail() {
    const [selectedExercise, setSelectedExercise] = useState(null);
    
    // Plan data
    const plan = {
        id: 1,
        name: 'Beginner Weight Loss Plan',
        category: 'Weight Loss',
        level: 'Beginner',
        duration: '12 weeks',
        weeklyWorkouts: 4,
        description: 'Perfect for those just starting their fitness journey. Focus on low-impact exercises and building healthy habits.',
        longDescription: 'This 12-week program is specifically designed for individuals who are overweight and new to exercise. You\'ll start with gentle movements and gradually build strength and endurance.',
        targetAudience: 'BMI 25-30, sedentary lifestyle, no previous exercise experience',
        goals: ['Lose 5-10% body weight', 'Build exercise habit', 'Improve mobility'],
        equipment: 'None (bodyweight only)',
        caloriesBurn: '200-300 per session',
        color: 'emerald',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        
        stats: [
            { label: 'Duration', value: '12 weeks', icon: '📅' },
            { label: 'Weekly', value: '4 workouts', icon: '🏋️' },
            { label: 'Per Session', value: '200-300 cal', icon: '🔥' },
            { label: 'Difficulty', value: 'Beginner', icon: '🌱' }
        ],
        
        weeks: [
            {
                number: 1,
                title: 'Foundation Week',
                focus: 'Building the base',
                workouts: [
                    {
                        day: 'Monday',
                        name: 'Seated Basics',
                        time: '15 min',
                        exercises: [
                            { id: 1, name: 'Seated Leg Lifts', sets: '3x10' },
                            { id: 2, name: 'Arm Circles', sets: '3x10' },
                            { id: 3, name: 'Seated Marches', sets: '3x10' }
                        ]
                    },
                    {
                        day: 'Wednesday',
                        name: 'Gentle Movement',
                        time: '15 min',
                        exercises: [
                            { id: 4, name: 'Neck Stretches', sets: 'Hold 15 sec' },
                            { id: 5, name: 'Shoulder Rolls', sets: '3x10' },
                            { id: 6, name: 'Seated Twists', sets: '3x8' }
                        ]
                    },
                    {
                        day: 'Friday',
                        name: 'Mobility Focus',
                        time: '15 min',
                        exercises: [
                            { id: 7, name: 'Ankle Circles', sets: '2x10' },
                            { id: 8, name: 'Wrist Stretches', sets: 'Hold 15 sec' },
                            { id: 9, name: 'Seated Forward Fold', sets: 'Hold 20 sec' }
                        ]
                    }
                ]
            },
            {
                number: 2,
                title: 'Strength Introduction',
                focus: 'Adding resistance',
                workouts: [
                    {
                        day: 'Monday',
                        name: 'Seated Strength',
                        time: '20 min',
                        exercises: [
                            { id: 1, name: 'Seated Leg Lifts', sets: '3x12' },
                            { id: 10, name: 'Chair Squats', sets: '3x10' },
                            { id: 11, name: 'Seated Rows', sets: '3x10' }
                        ]
                    },
                    {
                        day: 'Wednesday',
                        name: 'Standing Basics',
                        time: '20 min',
                        exercises: [
                            { id: 12, name: 'Wall Push-ups', sets: '3x8' },
                            { id: 13, name: 'Standing Marches', sets: '3x15' },
                            { id: 14, name: 'Side Leg Raises', sets: '3x10' }
                        ]
                    },
                    {
                        day: 'Friday',
                        name: 'Flexibility',
                        time: '20 min',
                        exercises: [
                            { id: 15, name: 'Cat-Cow Stretch', sets: '2x10' },
                            { id: 16, name: 'Child\'s Pose', sets: 'Hold 30 sec' },
                            { id: 17, name: 'Standing Quad Stretch', sets: 'Hold 20 sec' }
                        ]
                    }
                ]
            },
            {
                number: 3,
                title: 'Endurance Builder',
                focus: 'Increasing stamina',
                workouts: [
                    {
                        day: 'Monday',
                        name: 'Cardio Mix',
                        time: '25 min',
                        exercises: [
                            { id: 13, name: 'Marching in Place', sets: '3x20' },
                            { id: 18, name: 'Step Touches', sets: '3x15' },
                            { id: 19, name: 'Knee Lifts', sets: '3x12' }
                        ]
                    },
                    {
                        day: 'Wednesday',
                        name: 'Strength Circuit',
                        time: '25 min',
                        exercises: [
                            { id: 12, name: 'Wall Push-ups', sets: '3x10' },
                            { id: 20, name: 'Glute Bridges', sets: '3x12' },
                            { id: 21, name: 'Bird Dogs', sets: '3x8' }
                        ]
                    },
                    {
                        day: 'Friday',
                        name: 'Active Recovery',
                        time: '20 min',
                        exercises: [
                            { id: 22, name: 'Walking in Place', sets: '10 min' },
                            { id: 23, name: 'Full Body Stretch', sets: '10 min' }
                        ]
                    }
                ]
            }
        ],
        
        exercises: [
            {
                id: 1,
                name: 'Seated Leg Lifts',
                category: 'Seated',
                difficulty: 'Easy',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
                description: 'Strengthens thighs and core while seated.',
                instructions: [
                    'Sit tall with back straight',
                    'Lift right leg until parallel to floor',
                    'Hold for 2 seconds',
                    'Slowly lower',
                    'Repeat with left leg'
                ],
                tips: 'Keep your core engaged throughout',
                muscles: ['Quadriceps', 'Hip Flexors', 'Core']
            },
            {
                id: 10,
                name: 'Chair Squats',
                category: 'Strength',
                difficulty: 'Moderate',
                image: 'https://images.unsplash.com/photo-1566241142558-6e6a5f8a9f9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
                description: 'Build leg strength safely using a chair.',
                instructions: [
                    'Stand with feet shoulder-width apart',
                    'Slowly lower towards chair',
                    'Lightly touch and stand up',
                    'Keep chest up'
                ],
                tips: 'Control the movement, don\'t drop down',
                muscles: ['Quadriceps', 'Glutes', 'Hamstrings']
            },
            {
                id: 12,
                name: 'Wall Push-ups',
                category: 'Strength',
                difficulty: 'Easy',
                image: 'https://images.unsplash.com/photo-1598971639058-fabae1f9b9b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
                description: 'Upper body strength without floor work.',
                instructions: [
                    'Stand arm\'s length from wall',
                    'Place palms on wall',
                    'Bend elbows to lean in',
                    'Push back to start'
                ],
                tips: 'Step feet back for more challenge',
                muscles: ['Chest', 'Shoulders', 'Arms']
            }
        ]
    };

    return (
        <FitnessLayout>
            <Head title={`${plan.name} - FitLife`} />

            {/* Header with Back Button and Title */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <Link 
                            href="/workouts" 
                            className="p-2 hover:bg-gray-100 rounded-full transition duration-150"
                        >
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">{plan.level}</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">{plan.duration}</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">{plan.weeklyWorkouts} days/week</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Horizontal Plan Overview Cards */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Plan Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {plan.stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{stat.icon}</span>
                                    <div>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                        <p className="font-semibold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description and Goals Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">About this plan</h3>
                        <p className="text-sm text-gray-600">{plan.longDescription}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Target:</span> {plan.targetAudience}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Goals</h3>
                        <ul className="space-y-1">
                            {plan.goals.map((goal, index) => (
                                <li key={index} className="flex items-start text-sm">
                                    <span className="text-emerald-600 mr-2">✓</span>
                                    <span className="text-gray-600">{goal}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Equipment: {plan.equipment}</p>
                        </div>
                    </div>
                </div>

                {/* Week Sections - Horizontal */}
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Weekly Workout Plan</h2>
                <div className="space-y-6">
                    {plan.weeks.map((week) => (
                        <div key={week.number} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Week Header */}
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-semibold text-emerald-600">Week {week.number}</span>
                                        <h3 className="font-medium text-gray-900">{week.title}</h3>
                                        <p className="text-xs text-gray-500">Focus: {week.focus}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal Workout Cards */}
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {week.workouts.map((workout, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Workout Day Header */}
                                            <div className="bg-emerald-50 px-3 py-2 border-b border-gray-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-emerald-700 text-sm">{workout.day}</span>
                                                    <span className="text-xs bg-white px-2 py-0.5 rounded-full shadow-sm">
                                                        {workout.time}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{workout.name}</p>
                                            </div>

                                            {/* Exercise List */}
                                            <div className="p-3">
                                                <div className="space-y-2">
                                                    {workout.exercises.map((exercise, idx) => {
                                                        const exerciseDetail = plan.exercises.find(e => e.id === exercise.id);
                                                        return (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setSelectedExercise(exerciseDetail)}
                                                                className="w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition duration-150"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium text-gray-900">{exercise.name}</span>
                                                                    <span className="text-xs text-gray-500">{exercise.sets}</span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Start Plan Button */}
                <div className="mt-8 text-center">
                    <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition duration-150 shadow-lg">
                        Start This Plan
                    </button>
                </div>
            </div>

            {/* Exercise Detail Modal */}
            {selectedExercise && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedExercise.name}</h2>
                                <div className="flex space-x-2 mt-1">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                                        {selectedExercise.category}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                        {selectedExercise.difficulty}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedExercise(null)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4">
                            <div className="flex space-x-4 mb-4">
                                <img 
                                    src={selectedExercise.image} 
                                    alt={selectedExercise.name}
                                    className="w-24 h-24 rounded-lg object-cover"
                                />
                                <div>
                                    <p className="text-gray-600 text-sm">{selectedExercise.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedExercise.muscles.map((muscle, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                {muscle}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">How to do it:</h3>
                                <ol className="list-decimal list-inside space-y-1">
                                    {selectedExercise.instructions.map((step, index) => (
                                        <li key={index} className="text-sm text-gray-600">{step}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="bg-emerald-50 rounded-lg p-3">
                                <h4 className="font-semibold text-emerald-800 text-sm mb-1">💡 Pro Tip</h4>
                                <p className="text-sm text-emerald-700">{selectedExercise.tips}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </FitnessLayout>
    );
}