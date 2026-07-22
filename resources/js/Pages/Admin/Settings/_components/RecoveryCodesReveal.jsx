import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

/**
 * リカバリーコード発行直後の一度きりの表示コンポーネント。
 * 平文コードはこの時点以降サーバー側で二度と取得できない（ハッシュのみ保存）。
 */
const RecoveryCodesReveal = ({ codes, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!codes || codes.length === 0) return null;

    const handleCopyAll = async () => {
        await navigator.clipboard.writeText(codes.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="border-2 border-amber-400 dark:border-amber-500">
            <CardHeader>
                🔑 リカバリーコード（
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                    この画面を閉じると二度と表示できません
                </span>
                ）
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        認証アプリが使えない場合に、それぞれ1回だけログイン時のコード代わりに使用できます。安全な場所に保管してください。
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {codes.map((code) => (
                            <code
                                key={code}
                                className="block px-3 py-2 rounded bg-gray-100 dark:bg-slate-900 text-sm text-center"
                            >
                                {code}
                            </code>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <SecondaryButton
                            type="button"
                            size="sm"
                            onClick={handleCopyAll}
                        >
                            {copied ? (
                                <CheckIcon className="h-4 w-4" />
                            ) : (
                                <ClipboardDocumentIcon className="h-4 w-4" />
                            )}
                            {copied ? "コピーしました" : "すべてコピー"}
                        </SecondaryButton>
                        <SecondaryButton type="button" onClick={onClose}>
                            確認しました・閉じる
                        </SecondaryButton>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default RecoveryCodesReveal;
