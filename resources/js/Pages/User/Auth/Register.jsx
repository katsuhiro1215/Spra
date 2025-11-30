import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    EyeIcon,
    EyeSlashIcon,
    UserPlusIcon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import UserAuthLayout from "@/Layouts/UserAuthLayout";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("user.register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <UserAuthLayout>
            <Head title="ユーザー新規登録 | Smart Sprouts" />

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4">
                    <UserPlusIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    新規ユーザー登録
                </h1>
                <p className="text-gray-600">
                    Smart
                    Sproutsのサービスをご利用いただくために、アカウントを作成してください
                </p>
            </div>

            {/* Register Form */}
            <form onSubmit={submit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        お名前 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                errors.name
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                            placeholder="田中 太郎"
                            autoComplete="name"
                            autoFocus
                            required
                        />
                    </div>
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        メールアドレス <span className="text-red-500">*</span>
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
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                            placeholder="your@email.com"
                            autoComplete="username"
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

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        パスワード <span className="text-red-500">*</span>
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
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                            placeholder="8文字以上のパスワード"
                            autoComplete="new-password"
                            required
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

                {/* Password Confirmation Field */}
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        パスワード確認 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                                errors.password_confirmation
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            }`}
                            placeholder="パスワードを再入力"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors duration-200"
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* Terms Agreement */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 leading-relaxed">
                        アカウントを作成することで、Smart Sproutsの
                        <Link
                            href="/terms"
                            className="text-blue-600 hover:text-blue-700 underline"
                        >
                            利用規約
                        </Link>
                        および
                        <Link
                            href="/privacy"
                            className="text-blue-600 hover:text-blue-700 underline"
                        >
                            プライバシーポリシー
                        </Link>
                        に同意したものとみなします。
                    </p>
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        processing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 active:transform active:scale-[0.98]"
                    } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
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
                            登録中...
                        </div>
                    ) : (
                        "アカウントを作成"
                    )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        既にアカウントをお持ちの方は
                        <Link
                            href={route("user.login")}
                            className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                        >
                            ログイン
                        </Link>
                    </p>
                </div>
            </form>
        </UserAuthLayout>
    );
}
