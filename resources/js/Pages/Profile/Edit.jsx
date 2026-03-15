import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import FitnessLayout from '@/Layouts/FitnessLayout';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <FitnessLayout>
            
            <Head title="Profile" />
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold">Profile 👋</h1>
                    <p className="mt-2 opacity-90">You can edit your profile.</p>
                </div>
            </div>
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </FitnessLayout>
    );
}
