import { Head, Link, useForm } from '@inertiajs/react';
// Layouts
import GuestLayout from '@/Layouts/GuestLayout';
// Components
import PrimaryButton from '@/Components/PrimaryButton';

export default function VerifyEmail({ status }) {
    // フォーム状態管理
    const { post, processing } = useForm({});
    // フォーム送信ハンドラー
    const submit = (e) => {
        e.preventDefault();

        post(route('admin.verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Admin Email Verification" />
            
            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                    <Link
                        href={route("admin.logout")}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
