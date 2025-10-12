import { Head, useForm } from '@inertiajs/react';
// Layouts
import GuestLayout from '@/Layouts/GuestLayout';
// Components
import { TextInput, InputError } from '@/Components/Forms';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';

export default function ForgotPassword({ status }) {
    // フォーム状態管理
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    // フォーム送信ハンドラー
    const submit = (e) => {
        e.preventDefault();

        post(route('admin.password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Admin Forgot Password" />

            <div className="mb-4 text-sm text-gray-600">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Email Password Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
