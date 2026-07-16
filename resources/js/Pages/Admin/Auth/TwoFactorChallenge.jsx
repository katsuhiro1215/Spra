import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardBody } from "@/Components/Card";
import { InputError } from "@/Components/Forms";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import { FlashMessage } from "@/Components/Notifications";

export default function TwoFactorChallenge({ method = "email" }) {
    const isTotp = method === "totp";
    const { data, setData, post, processing, errors } = useForm({
        code: "",
    });
    const [resending, setResending] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.two-factor.store"));
    };

    const resend = () => {
        setResending(true);
        post(route("admin.two-factor.resend"), {
            onFinish: () => setResending(false),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
            <Head title="二段階認証" />

            <FlashMessage />

            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        二段階認証
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isTotp
                            ? "認証アプリに表示されている6桁のコードを入力してください"
                            : "メールに送信された6桁の認証コードを入力してください"}
                    </p>
                </div>

                <Card>
                    <CardBody className="px-8 py-8 space-y-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                    className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="000000"
                                    maxLength={isTotp ? 20 : 6}
                                    autoComplete="one-time-code"
                                    autoFocus
                                />
                                <InputError message={errors.code} />
                            </div>

                            <PrimaryButton
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                disabled={processing}
                            >
                                {processing ? "確認中..." : "認証する"}
                            </PrimaryButton>
                        </form>

                        {isTotp ? (
                            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                認証アプリが使えない場合は、発行済みのリカバリーコードを入力してください
                            </p>
                        ) : (
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={resend}
                                    disabled={resending}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                                >
                                    {resending ? "送信中..." : "コードを再送信する"}
                                </button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
