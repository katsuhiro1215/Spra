import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    EnvelopeIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import UserAuthLayout from "@/Layouts/UserAuthLayout";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("user.password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <UserAuthLayout>
            <Head title="新しいパスワードの設定 | Smart Sprouts" />

            {/* Header Section */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                    <KeyIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    新しいパスワードの設定
                </h1>
                <p className="text-gray-600">
                    新しいパスワードを入力して、アカウントのセキュリティを確保してください
                </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={submit} className="space-y-6">
                {/* Email Field (Read Only) */}
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
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 focus:outline-none"
                            readOnly
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* New Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        新しいパスワード <span className="text-red-500">*</span>
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
                                    : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                            }`}
                            placeholder="8文字以上の新しいパスワード"
                            autoComplete="new-password"
                            autoFocus
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
                                    : "border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
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

                {/* Security Tips */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                        💡 安全なパスワードのヒント
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• 8文字以上の長さにする</li>
                        <li>• 大文字・小文字・数字・記号を組み合わせる</li>
                        <li>• 他のサービスと同じパスワードは使わない</li>
                        <li>• 個人情報（名前、生年月日など）は避ける</li>
                    </ul>
                </div>

                {/* Reset Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        processing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:transform active:scale-[0.98]"
                    } text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
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
                            設定中...
                        </div>
                    ) : (
                        <>
                            <KeyIcon className="w-5 h-5 inline-block mr-2" />
                            パスワードを更新
                        </>
                    )}
                </button>
            </form>
        </UserAuthLayout>
    );
}
