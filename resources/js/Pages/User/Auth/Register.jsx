import { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    EyeIcon,
    EyeSlashIcon,
    UserPlusIcon,
    EnvelopeIcon,
    LockClosedIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import UserAuthLayout from "@/Layouts/UserAuthLayout";

// 招待リンク経由でのみアクセスされる（招待なしの自己登録は廃止済み）
export default function Register({ invitation, requiredDocuments = [] }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        invitation_token: invitation.token,
        email: invitation.email,
        password: "",
        password_confirmation: "",
        has_company: !!invitation.contact.company,
        company_name: invitation.contact.company || "",
        company_type: "corporate",
        company_registration_number: "",
        company_phone: "",
        company_address: "",
        accepted_document_version_ids: [],
    });

    const [agreedToDocuments, setAgreedToDocuments] = useState(false);

    const handleAgreeChange = (checked) => {
        setAgreedToDocuments(checked);
        setData(
            "accepted_document_version_ids",
            checked ? requiredDocuments.map((doc) => doc.version_id) : [],
        );
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("user.register.store"), {
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
                    招待からのアカウント作成
                </h1>
                <p className="text-gray-600">
                    {invitation.contact.name}{" "}
                    様、アカウント作成にご協力いただきありがとうございます
                </p>
            </div>

            {/* Success/Error Messages */}
            {flash?.error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600 flex items-center">
                        <span className="mr-2">⚠️</span>
                        {flash.error}
                    </p>
                </div>
            )}

            {/* Register Form */}
            <form onSubmit={submit} className="space-y-6">
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
                            disabled
                            className="block w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-200 bg-gray-100 cursor-not-allowed border-gray-300"
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

                {/* Company Information Section */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center mb-4">
                        <input
                            id="has_company"
                            type="checkbox"
                            checked={data.has_company}
                            onChange={(e) =>
                                setData("has_company", e.target.checked)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="has_company"
                            className="ml-2 block text-sm font-medium text-gray-700"
                        >
                            会社情報を登録する
                        </label>
                    </div>

                    {data.has_company && (
                        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                            {/* Company Name */}
                            <div>
                                <label
                                    htmlFor="company_name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    会社名{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="company_name"
                                        type="text"
                                        name="company_name"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                "company_name",
                                                e.target.value,
                                            )
                                        }
                                        disabled={!!invitation.contact.company}
                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm ${
                                            invitation.contact.company
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : "bg-white"
                                        } ${
                                            errors.company_name
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="株式会社〇〇"
                                        required={data.has_company}
                                    />
                                </div>
                                {errors.company_name && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.company_name}
                                    </p>
                                )}
                            </div>

                            {/* Company Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    会社形態{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="company_type"
                                            value="corporate"
                                            checked={
                                                data.company_type ===
                                                "corporate"
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "company_type",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            法人
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="company_type"
                                            value="individual"
                                            checked={
                                                data.company_type ===
                                                "individual"
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "company_type",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            個人事業主
                                        </span>
                                    </label>
                                </div>
                                {errors.company_type && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.company_type}
                                    </p>
                                )}
                            </div>

                            {/* Registration Number */}
                            <div>
                                <label
                                    htmlFor="company_registration_number"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    法人番号
                                </label>
                                <input
                                    id="company_registration_number"
                                    type="text"
                                    name="company_registration_number"
                                    value={data.company_registration_number}
                                    onChange={(e) =>
                                        setData(
                                            "company_registration_number",
                                            e.target.value,
                                        )
                                    }
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                    placeholder="1234567890123"
                                />
                                {errors.company_registration_number && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.company_registration_number}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label
                                    htmlFor="company_phone"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    電話番号
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="company_phone"
                                        type="tel"
                                        name="company_phone"
                                        value={data.company_phone}
                                        onChange={(e) =>
                                            setData(
                                                "company_phone",
                                                e.target.value,
                                            )
                                        }
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                        placeholder="03-1234-5678"
                                    />
                                </div>
                                {errors.company_phone && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.company_phone}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label
                                    htmlFor="company_address"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    住所
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="company_address"
                                        name="company_address"
                                        value={data.company_address}
                                        onChange={(e) =>
                                            setData(
                                                "company_address",
                                                e.target.value,
                                            )
                                        }
                                        rows={2}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                        placeholder="東京都渋谷区〇〇1-2-3"
                                    />
                                </div>
                                {errors.company_address && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.company_address}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Terms Agreement */}
                {requiredDocuments.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreedToDocuments}
                                onChange={(e) =>
                                    handleAgreeChange(e.target.checked)
                                }
                                className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-xs text-gray-600 leading-relaxed">
                                以下の内容を確認し、同意します。
                                {requiredDocuments.map((doc, index) => (
                                    <span key={doc.slug}>
                                        {index > 0 && "、"}
                                        <Link
                                            href={route(
                                                "documents.show",
                                                doc.slug,
                                            )}
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-700 underline"
                                        >
                                            {doc.title}
                                        </Link>
                                    </span>
                                ))}
                            </span>
                        </label>
                        {errors.acceptance && (
                            <p className="mt-2 text-xs text-red-600">
                                {errors.acceptance}
                            </p>
                        )}
                    </div>
                )}

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={
                        processing ||
                        (requiredDocuments.length > 0 && !agreedToDocuments)
                    }
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        processing ||
                        (requiredDocuments.length > 0 && !agreedToDocuments)
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
