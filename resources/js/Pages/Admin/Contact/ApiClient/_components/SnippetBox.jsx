import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { SecondaryButton } from "@/Components/Buttons";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

/**
 * APIキー発行直後の一度きりの表示コンポーネント。
 * 平文キーはこの時点以降サーバー側で二度と取得できない。
 */
const SnippetBox = ({ reveal, onClose }) => {
    const [copiedField, setCopiedField] = useState(null);

    if (!reveal) return null;

    const snippet = `<?php
/**
 * ${reveal.name} 用 お問い合わせAPI連携スニペット
 * functions.php に追加するか、フォーム送信処理から呼び出してください。
 */
function spra_submit_contact(array $formData): bool {
    $response = wp_remote_post('${reveal.apiBaseUrl}', [
        'headers' => [
            'X-Api-Key'    => '${reveal.plainKey}',
            'Content-Type' => 'application/json',
        ],
        'body' => wp_json_encode([
            'name'               => $formData['name'],
            'email'              => $formData['email'],
            'phone'              => $formData['phone'] ?? null,
            'company'            => $formData['company'] ?? null,
            'contact_category_id' => $formData['contact_category_id'],
            'subject'            => $formData['subject'],
            'message'            => $formData['message'],
            'page_url'           => $_SERVER['HTTP_REFERER'] ?? '',
            'visitor_ip'         => $_SERVER['REMOTE_ADDR'] ?? '',
            'visitor_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
        ]),
        'timeout' => 10,
    ]);

    if (is_wp_error($response)) {
        return false;
    }

    return wp_remote_retrieve_response_code($response) === 200;
}`;

    const handleCopy = async (text, field) => {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <Card className="border-2 border-amber-400 dark:border-amber-500">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <span>
                        🔑 APIキーが発行されました（
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                            この画面を閉じると二度と表示できません
                        </span>
                        ）
                    </span>
                </div>
            </CardHeader>
            <CardBody>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            APIキー
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 block px-3 py-2 rounded bg-gray-100 dark:bg-slate-900 text-sm break-all">
                                {reveal.plainKey}
                            </code>
                            <SecondaryButton
                                type="button"
                                size="sm"
                                onClick={() =>
                                    handleCopy(reveal.plainKey, "key")
                                }
                            >
                                {copiedField === "key" ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                )}
                            </SecondaryButton>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            WordPress貼り付け用スニペット
                        </p>
                        <div className="relative">
                            <pre className="overflow-x-auto rounded bg-gray-900 text-gray-100 text-xs p-4 whitespace-pre">
                                {snippet}
                            </pre>
                            <SecondaryButton
                                type="button"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => handleCopy(snippet, "snippet")}
                            >
                                {copiedField === "snippet" ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                )}
                            </SecondaryButton>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <SecondaryButton type="button" onClick={onClose}>
                            確認しました・閉じる
                        </SecondaryButton>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default SnippetBox;
