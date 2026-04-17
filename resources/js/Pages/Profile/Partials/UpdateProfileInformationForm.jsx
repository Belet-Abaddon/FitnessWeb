import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { User, Weight, Save, CheckCircle2, Info } from 'lucide-react';

export default function UpdateProfileInformation({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            email: user.email || '',
            age: user.age || '',
            gender: user.gender || '',
            height: user.height || '',
            weight: user.weight || '',
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={`max-w-5x4 mx-auto space-y-6`}>
            <form onSubmit={submit} className="space-y-6">
                
                {/* 1. IDENTITY HEADER */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative">
                    <div className="h-28 w-28 bg-gradient-to-br from-indigo-600 to-blue-400 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100">
                        {user.name ? user.name.charAt(0) : '?'}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                            <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider w-fit mx-auto md:mx-0">
                                {user.role}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium mb-4">{user.email}</p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-6 border-t border-gray-50 pt-4">
                            <div className="text-center md:text-left">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Current BMI</p>
                                <p className="text-lg font-black text-blue-600">{user.current_bmi || '0.0'}</p>
                            </div>
                            <div className="h-8 w-[1px] bg-gray-100" />
                            <div className="text-center md:text-left">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Weight</p>
                                <p className="text-lg font-black text-gray-900">{user.weight ? `${user.weight} kg` : '--'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. INPUT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT CARD: ACCOUNT */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gray-50 rounded-lg"><User size={20} className="text-gray-400" /></div>
                            <h3 className="font-bold text-gray-900">Account Details</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" />
                                <TextInput id="name" className="w-full bg-gray-50/50 border-gray-100 mt-1" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" />
                                <TextInput id="email" type="email" className="w-full bg-gray-50/50 border-gray-100 mt-1" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                <InputError message={errors.email} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD: FITNESS METRICS */}
                    <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gray-50 rounded-lg"><Weight size={20} className="text-gray-400" /></div>
                            <h3 className="font-bold text-gray-900">Physical Profile</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-1">
                                <InputLabel value="Age (Years)" />
                                <TextInput type="number" className="w-full bg-gray-50/50 border-gray-100" value={data.age} onChange={(e) => setData('age', e.target.value)} />
                                <InputError message={errors.age} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Gender" />
                                <select 
                                    className="w-full border-gray-100 bg-gray-50/50 rounded-xl text-sm focus:ring-blue-500 py-3"
                                    value={data.gender} 
                                    onChange={(e) => setData('gender', e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <InputError message={errors.gender} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Height (cm)" />
                                <TextInput type="number" step="0.1" className="w-full bg-gray-50/50 border-gray-100" value={data.height} onChange={(e) => setData('height', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <InputLabel value="Weight (kg)" />
                                <TextInput type="number" step="0.1" className="w-full bg-gray-50/50 border-gray-100" value={data.weight} onChange={(e) => setData('weight', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. SUBMIT BAR */}
                <div className="bg-white px-8 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Info size={16} />
                        <p className="text-xs font-medium">BMI is updated automatically upon save.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition duration-500 ease-out"
                            enterFrom="scale-95 opacity-0"
                            enterTo="scale-100 opacity-100"
                        >
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                <CheckCircle2 size={18} />
                                Updated!
                            </div>
                        </Transition>

                        <PrimaryButton 
                            disabled={processing} 
                            className="bg-blue-600 hover:bg-gray-900 rounded-2xl py-3 px-10 flex items-center gap-2 shadow-lg shadow-blue-100"
                        >
                            <Save size={18} />
                            Save Profile
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </section>
    );
}