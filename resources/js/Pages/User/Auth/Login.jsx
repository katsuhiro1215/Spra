import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    EyeIcon,
    EyeSlashIcon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import UserAuthLayout from "@/Layouts/UserAuthLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("user.login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <UserAuthLayout>
            <Head title="ユーザーログイン | Smart Sprouts" />

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                    <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    ユーザーログイン
                </h1>
                <p className="text-gray-600">
                    アカウントにログインして利用を開始しましょう
                </p>
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 text-center">
                        {status}
                    </p>
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={submit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        メールアドレス
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
                                    : "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                            }`}
                            placeholder="your@email.com"
                            autoComplete="username"
                            autoFocus
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        パスワード
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                errors.password
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-300 focus:border-green-500 focus:ring-green-500/20"
                            }`}
                            placeholder="パスワードを入力"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            ログイン状態を保持
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("user.password.request")}
                            className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                        >
                            パスワードを忘れた方
                        </Link>
                    )}
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        processing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 active:transform active:scale-[0.98]"
                    } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
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
                            ログイン中...
                        </div>
                    ) : (
                        "ログイン"
                    )}
                </button>

                {/* Dashboard Link */}
                <div className="text-center pt-4">
                    <Link
                        href={route("user.dashboard")}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        管理画面を見る
                    </Link>
                </div>

                {/* Register Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        アカウントをお持ちでない方は
                        <Link
                            href={route("user.register")}
                            className="ml-1 text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                        >
                            新規登録
                        </Link>
                    </p>
                </div>
            </form>
        </UserAuthLayout>
    );
}
