import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    FormSelect,
    Toggle,
    InputError,
} from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";

const AUTH_TYPE_OPTIONS = [
    { value: "none", label: "認証なし" },
    { value: "bearer", label: "Bearerトークン" },
    { value: "api_key", label: "APIキー（ヘッダー）" },
    { value: "basic", label: "Basic認証（user:pass）" },
];

const Form = ({ service = null, isEditing = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        name: service?.name || "",
        category: service?.category || "",
        url: service?.url || "",
        icon: service?.icon || "",
        description: service?.description || "",
        is_active: service?.is_active ?? true,
        api_base_url: service?.api_base_url || "",
        api_endpoint: service?.api_endpoint || "",
        auth_type: service?.auth_type || "none",
        auth_header: service?.auth_header || "",
        credential: "",
    });
    const [showApiSettings, setShowApiSettings] = useState(
        !!service?.api_base_url,
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && service) {
            put(route("admin.external-service.update", service.id), {
                preserveScroll: true,
            });
        } else {
            post(route("admin.external-service.store"), {
                preserveScroll: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>基本情報</CardHeader>
                <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup label="サービス名" required error={errors.name}>
                            <TextInput
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="例: freee会計"
                                required
                            />
                        </FormGroup>

                        <FormGroup label="分類" error={errors.category}>
                            <TextInput
                                value={data.category}
                                onChange={(e) => setData("category", e.target.value)}
                                placeholder="例: 会計、CRM、勤怠"
                            />
                        </FormGroup>

                        <FormGroup
                            label="リンクURL"
                            required
                            error={errors.url}
                            className="md:col-span-2"
                        >
                            <TextInput
                                type="url"
                                value={data.url}
                                onChange={(e) => setData("url", e.target.value)}
                                placeholder="https://example.com/login"
                                required
                            />
                        </FormGroup>

                        <FormGroup
                            label="アイコン"
                            error={errors.icon}
                            className="md:col-span-2"
                        >
                            <TextInput
                                value={data.icon}
                                onChange={(e) => setData("icon", e.target.value)}
                                placeholder="絵文字（例: 💰）または画像URL"
                            />
                        </FormGroup>

                        <FormGroup
                            label="説明"
                            error={errors.description}
                            className="md:col-span-2"
                        >
                            <TextArea
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                rows={3}
                            />
                        </FormGroup>
                    </div>

                    <div className="flex items-center gap-3">
                        <Toggle
                            enabled={data.is_active}
                            onChange={(v) => setData("is_active", v)}
                            label="有効"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            有効にすると一覧に表示され、リンクへアクセスできます
                        </span>
                    </div>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <span>API連携設定（任意）</span>
                        <button
                            type="button"
                            onClick={() => setShowApiSettings((v) => !v)}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            {showApiSettings ? "閉じる" : "設定する"}
                        </button>
                    </div>
                </CardHeader>
                {showApiSettings && (
                    <CardBody className="space-y-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            サービス側のAPIからデータを定期的に取得し、一覧画面でステータスを確認できるようにします。
                            処理自体は各サービス側で完結し、ここでは取得結果のスナップショットのみ保持します。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormGroup
                                label="APIベースURL"
                                error={errors.api_base_url}
                            >
                                <TextInput
                                    type="url"
                                    value={data.api_base_url}
                                    onChange={(e) =>
                                        setData("api_base_url", e.target.value)
                                    }
                                    placeholder="https://api.example.com"
                                />
                            </FormGroup>

                            <FormGroup label="エンドポイント" error={errors.api_endpoint}>
                                <TextInput
                                    value={data.api_endpoint}
                                    onChange={(e) =>
                                        setData("api_endpoint", e.target.value)
                                    }
                                    placeholder="/v1/summary"
                                />
                            </FormGroup>

                            <FormGroup label="認証方式" error={errors.auth_type}>
                                <FormSelect
                                    name="auth_type"
                                    value={data.auth_type}
                                    onChange={(e) =>
                                        setData("auth_type", e.target.value)
                                    }
                                    options={AUTH_TYPE_OPTIONS}
                                />
                            </FormGroup>

                            {data.auth_type === "api_key" && (
                                <FormGroup
                                    label="ヘッダー名"
                                    error={errors.auth_header}
                                >
                                    <TextInput
                                        value={data.auth_header}
                                        onChange={(e) =>
                                            setData("auth_header", e.target.value)
                                        }
                                        placeholder="X-Api-Key"
                                    />
                                </FormGroup>
                            )}

                            {data.auth_type !== "none" && (
                                <FormGroup
                                    label={
                                        data.auth_type === "basic"
                                            ? "認証情報（user:password）"
                                            : "トークン / APIキー"
                                    }
                                    error={errors.credential}
                                    className="md:col-span-2"
                                    helpText={
                                        isEditing
                                            ? "既存の値を保持する場合は空欄のまま保存してください。"
                                            : undefined
                                    }
                                >
                                    <TextInput
                                        type="password"
                                        autoComplete="new-password"
                                        value={data.credential}
                                        onChange={(e) =>
                                            setData("credential", e.target.value)
                                        }
                                        placeholder={
                                            isEditing ? "変更する場合のみ入力" : ""
                                        }
                                    />
                                </FormGroup>
                            )}
                        </div>
                    </CardBody>
                )}
            </Card>

            <div className="flex gap-3">
                <PrimaryButton type="submit" disabled={processing}>
                    {isEditing ? "更新" : "作成"}
                </PrimaryButton>
                <SecondaryButton
                    type="button"
                    href={route("admin.external-service.index")}
                    disabled={processing}
                >
                    キャンセル
                </SecondaryButton>
            </div>
        </form>
    );
};

export default Form;
