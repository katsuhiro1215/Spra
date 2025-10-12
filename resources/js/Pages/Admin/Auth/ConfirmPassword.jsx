import { Head, useForm } from '@inertiajs/react';
// Layouts
import GuestLayout from '@/Layouts/GuestLayout';
// Components
import { InputError, InputLabel, TextInput } from '@/Components/Forms';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';

export default function ConfirmPassword() {
    // フォーム状態管理
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });
    // フォーム送信ハンドラー
    const submit = (e) => {
        e.preventDefault();

        post(route('admin.password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Admin Confirm Password" />
            
            <div className="mb-4 text-sm text-gray-600">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Confirm
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
