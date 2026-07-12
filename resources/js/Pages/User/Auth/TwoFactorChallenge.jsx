import { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import UserAuthLayout from "@/Layouts/UserAuthLayout";

export default function TwoFactorChallenge() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        code: "",
    });
    const [resending, setResending] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("user.two-factor.store"));
    };

    const resend = () => {
        setResending(true);
        post(route("user.two-factor.resend"), {
            onFinish: () => setResending(false),
        });
    };

    return (
        <UserAuthLayout>
            <Head title="二段階認証 | Smart Sprouts" />

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    二段階認証
                </h1>
                <p className="text-gray-600">
                    メールに送信された6桁の認証コードを入力してください
                </p>
            </div>

            {flash?.status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 text-center">
                        {flash.status}
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <input
                        type="text"
                        value={data.code}
                        onChange={(e) => setData("code", e.target.value)}
                        className={`block w-full px-4 py-3 text-center text-2xl tracking-widest border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                            errors.code
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                        }`}
                        placeholder="000000"
                        maxLength={6}
                        autoComplete="one-time-code"
                        autoFocus
                    />
                    {errors.code && (
                        <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                            <span className="mr-1">⚠️</span>
                            {errors.code}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        processing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                >
                    {processing ? "確認中..." : "認証する"}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={resend}
                        disabled={resending}
                        className="text-sm text-green-600 hover:text-green-700 font-medium disabled:text-gray-400"
                    >
                        {resending
                            ? "送信中..."
                            : "コードを再送信する"}
                    </button>
                </div>
            </form>
        </UserAuthLayout>
    );
}
