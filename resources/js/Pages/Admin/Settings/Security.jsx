import { useState } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { InputError } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import RecoveryCodesReveal from "./_components/RecoveryCodesReveal";

export default function Security({
    twoFactorEnabled,
    twoFactorMethod,
    totpConfirmed,
    recoveryCodesRemaining,
}) {
    const { flash } = usePage().props;
    const isTotp = twoFactorEnabled && twoFactorMethod === "totp" && totpConfirmed;
    const isEmail = twoFactorEnabled && !isTotp;

    const { data, setData, put, processing } = useForm({
        two_factor_enabled: twoFactorEnabled,
    });

    const toggleEmail = () => {
        const next = !twoFactorEnabled;
        setData("two_factor_enabled", next);
        put(route("admin.security.update"), {
            data: { two_factor_enabled: next },
        });
    };

    const [settingUp, setSettingUp] = useState(false);
    const confirmForm = useForm({ code: "" });

    const startTotpSetup = () => {
        setSettingUp(true);
        router.post(
            route("admin.security.totp.setup"),
            {},
            { preserveScroll: true },
        );
    };

    const cancelSetup = () => {
        setSettingUp(false);
        confirmForm.reset();
    };

    const confirmTotp = (e) => {
        e.preventDefault();
        confirmForm.post(route("admin.security.totp.confirm"), {
            preserveScroll: true,
            onSuccess: () => {
                setSettingUp(false);
                confirmForm.reset();
            },
        });
    };

    const regenerateRecoveryCodes = () => {
        if (
            !confirm(
                "リカバリーコードを再発行しますか？以前のコードは無効になります。",
            )
        ) {
            return;
        }
        router.post(
            route("admin.security.recovery-codes.regenerate"),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="セキュリティ"
                    description="ログイン時の二段階認証を設定します"
                />
            }
        >
            <Head title="セキュリティ設定" />

            <FlashMessage />

            <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {flash?.recoveryCodesReveal && (
                    <RecoveryCodesReveal
                        codes={flash.recoveryCodesReveal}
                        onClose={() => router.reload()}
                    />
                )}

                <Card>
                    <CardHeader>二段階認証（メール認証）</CardHeader>
                    <CardBody>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    有効にすると、ログイン時にパスワードに加えて、メールに送信される6桁の認証コードの入力が必要になります。
                                </p>
                                {isTotp && (
                                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                                        現在は認証アプリ方式が有効です。ここで無効化すると認証アプリ設定も解除されます。
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={toggleEmail}
                                disabled={processing}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                                    twoFactorEnabled
                                        ? "bg-green-600"
                                        : "bg-gray-300 dark:bg-gray-600"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        twoFactorEnabled
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                        <p className="mt-4 text-sm font-medium">
                            現在の状態:{" "}
                            <span
                                className={
                                    twoFactorEnabled
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-gray-500 dark:text-gray-400"
                                }
                            >
                                {!twoFactorEnabled
                                    ? "無効"
                                    : isTotp
                                      ? "有効（認証アプリ）"
                                      : "有効（メール）"}
                            </span>
                        </p>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>二段階認証（認証アプリ / TOTP）</CardHeader>
                    <CardBody className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Google Authenticator等の認証アプリで生成される6桁のコードを使用します。メールより安全性が高く、メール受信環境に依存しません。
                        </p>

                        {isTotp ? (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                    認証アプリが設定済みです。
                                </p>
                                {recoveryCodesRemaining !== null && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        残りのリカバリーコード:{" "}
                                        <span className="font-semibold">
                                            {recoveryCodesRemaining}
                                        </span>{" "}
                                        個
                                    </p>
                                )}
                                <SecondaryButton
                                    type="button"
                                    onClick={regenerateRecoveryCodes}
                                >
                                    リカバリーコードを再発行
                                </SecondaryButton>
                            </div>
                        ) : settingUp || flash?.totpSetup ? (
                            <div className="space-y-4">
                                {flash?.totpSetup && (
                                    <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                        <div
                                            className="bg-white p-2 rounded"
                                            dangerouslySetInnerHTML={{
                                                __html: flash.totpSetup.qrSvg,
                                            }}
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            読み取れない場合は手動でキーを入力してください
                                        </p>
                                        <code className="text-xs break-all bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            {flash.totpSetup.secret}
                                        </code>
                                    </div>
                                )}
                                <form
                                    onSubmit={confirmTotp}
                                    className="space-y-3"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            認証アプリに表示された6桁のコード
                                        </label>
                                        <input
                                            type="text"
                                            value={confirmForm.data.code}
                                            onChange={(e) =>
                                                confirmForm.setData(
                                                    "code",
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={6}
                                            autoComplete="one-time-code"
                                            className="w-40 px-3 py-2 text-center text-xl tracking-widest border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="000000"
                                        />
                                        <InputError
                                            message={confirmForm.errors.code}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <PrimaryButton
                                            type="submit"
                                            disabled={confirmForm.processing}
                                        >
                                            確認して有効化
                                        </PrimaryButton>
                                        <SecondaryButton
                                            type="button"
                                            onClick={cancelSetup}
                                        >
                                            キャンセル
                                        </SecondaryButton>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <PrimaryButton type="button" onClick={startTotpSetup}>
                                認証アプリを設定する
                            </PrimaryButton>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
