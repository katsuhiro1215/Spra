import React from "react";
import FormGroup from "@/Components/Forms/FormGroup";
import TextInput from "@/Components/Forms/TextInput";
import TextArea from "@/Components/Forms/TextArea";
import ColorInput from "@/Components/Forms/ColorInput";
import { Card, CardHeader, CardBody } from "@/Components/Card";

export default function ProjectCategoryForm({ data, setData, errors }) {
    // スラッグを自動生成
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleNameChange = (value) => {
        setData({
            ...data,
            name: value,
            slug: data.slug || generateSlug(value),
        });
    };

    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <Card>
                <CardHeader>基本情報</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="カテゴリ名"
                            required
                            error={errors.name}
                        >
                            <TextInput
                                value={data.name || ""}
                                onChange={handleNameChange}
                                placeholder="例: Webサイト制作"
                                error={errors.name}
                            />
                        </FormGroup>

                        <FormGroup
                            label="スラッグ"
                            required
                            error={errors.slug}
                            hint="URL等で使用される識別子（半角英数字とハイフン）"
                        >
                            <TextInput
                                value={data.slug || ""}
                                onChange={(value) =>
                                    setData({ ...data, slug: value })
                                }
                                placeholder="例: website-development"
                                error={errors.slug}
                            />
                        </FormGroup>

                        <FormGroup label="説明" error={errors.description}>
                            <TextArea
                                value={data.description || ""}
                                onChange={(value) =>
                                    setData({ ...data, description: value })
                                }
                                placeholder="カテゴリの説明を入力してください"
                                rows={3}
                                error={errors.description}
                            />
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>

            {/* 表示設定 */}
            <Card>
                <CardHeader>表示設定</CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <FormGroup
                            label="カラー"
                            required
                            error={errors.color}
                            hint="カテゴリの識別色"
                        >
                            <ColorInput
                                value={data.color || "#3B82F6"}
                                onChange={(value) =>
                                    setData({ ...data, color: value })
                                }
                                error={errors.color}
                            />
                        </FormGroup>

                        <FormGroup
                            label="アイコン"
                            error={errors.icon}
                            hint="絵文字またはアイコン文字（例: 🌐 📱 💻）"
                        >
                            <TextInput
                                value={data.icon || ""}
                                onChange={(value) =>
                                    setData({ ...data, icon: value })
                                }
                                placeholder="例: 🌐"
                                error={errors.icon}
                            />
                        </FormGroup>

                        <FormGroup label="表示順" error={errors.sort_order}>
                            <TextInput
                                type="number"
                                value={data.sort_order || 0}
                                onChange={(value) =>
                                    setData({
                                        ...data,
                                        sort_order: parseInt(value) || 0,
                                    })
                                }
                                min="0"
                                error={errors.sort_order}
                            />
                        </FormGroup>

                        <FormGroup label="ステータス" error={errors.is_active}>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active ?? true}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            is_active: e.target.checked,
                                        })
                                    }
                                    className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                    アクティブ（有効化）
                                </span>
                            </label>
                        </FormGroup>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
