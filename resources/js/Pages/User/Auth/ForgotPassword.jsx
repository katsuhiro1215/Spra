import { Head, Link, useForm } from "@inertiajs/react";
import {
    KeyIcon,
    EnvelopeIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import UserAuthLayout from "@/Layouts/UserAuthLayout";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("user.password.email"));
    };

    return (
        <UserAuthLayout>
            <Head title="パスワードリセット | Smart Sprouts" />

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                    <KeyIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    パスワードをお忘れですか？
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                    メールアドレスを入力いただければ、
                    <br />
                    パスワード再設定用のリンクをお送りします。
                </p>
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-green-600 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-sm text-green-700">{status}</p>
                    </div>
                </div>
            )}

            {/* Reset Form */}
            <form onSubmit={submit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        登録されているメールアドレス
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                errors.email
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500/20"
                            }`}
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        processing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 active:transform active:scale-[0.98]"
                    } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
                >
                    {processing ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            送信中...
                        </div>
                    ) : (
                        <>
                            <EnvelopeIcon className="w-5 h-5 inline-block mr-2" />
                            パスワードリセットリンクを送信
                        </>
                    )}
                </button>

                {/* Back to Login */}
                <div className="text-center pt-6 border-t border-gray-200">
                    <Link
                        href={route("user.login")}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-1" />
                        ログイン画面に戻る
                    </Link>
                </div>
            </form>
        </UserAuthLayout>
    );
}
