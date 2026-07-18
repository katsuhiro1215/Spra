import { useState } from "react";
import FormGroup from "./FormGroup";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import ColorInput from "./ColorInput";
import NumberInput from "./NumberInput";
import Checkbox from "./Checkbox";

// ドラッグ機能を追加する場合は @dnd-kit/core のインストールが必要です
// npm install @dnd-kit/core @dnd-kit/sortable

export default function ArrayFieldEditor({
    value = [],
    onChange,
    itemsSchema = {},
    label = "アイテム",
    className = "",
}) {
    const items = value || [];

    // 新しいアイテムの初期値を生成
    const createEmptyItem = () => {
        const newItem = {};
        Object.entries(itemsSchema).forEach(([key, config]) => {
            if (config.default !== undefined) {
                newItem[key] = config.default;
            } else if (config.type === "boolean") {
                newItem[key] = false;
            } else if (config.type === "number") {
                newItem[key] = 0;
            } else if (config.type === "array") {
                newItem[key] = [];
            } else {
                newItem[key] = "";
            }
        });
        return newItem;
    };

    const addItem = () => {
        const newItems = [...items, createEmptyItem()];
        onChange?.(newItems);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange?.(newItems);
    };

    const updateItem = (index, field, fieldValue) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: fieldValue };
        onChange?.(newItems);
    };

    const moveItem = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= items.length) return;

        const newItems = [...items];
        [newItems[index], newItems[newIndex]] = [
            newItems[newIndex],
            newItems[index],
        ];
        onChange?.(newItems);
    };

    // フィールドのコンポーネントを取得
    const renderField = (item, index, fieldKey, fieldConfig) => {
        const commonProps = {
            value: item[fieldKey],
            onChange: (val) => updateItem(index, fieldKey, val),
        };

        switch (fieldConfig.type) {
            case "text":
            case "image":
            case "icon":
                return (
                    <FormGroup
                        label={fieldConfig.label || fieldKey}
                        required={fieldConfig.required}
                    >
                        <TextInput
                            value={commonProps.value}
                            onChange={(e) => commonProps.onChange(e.target.value)}
                            placeholder={
                                fieldConfig.default || fieldConfig.label
                            }
                        />
                    </FormGroup>
                );

            case "textarea":
            case "richtext":
                return (
                    <FormGroup
                        label={fieldConfig.label || fieldKey}
                        required={fieldConfig.required}
                    >
                        <TextArea
                            value={commonProps.value}
                            onChange={(e) => commonProps.onChange(e.target.value)}
                            placeholder={
                                fieldConfig.default || fieldConfig.label
                            }
                            rows={3}
                        />
                    </FormGroup>
                );

            case "color":
                return (
                    <FormGroup
                        label={fieldConfig.label || fieldKey}
                        required={fieldConfig.required}
                    >
                        <ColorInput {...commonProps} />
                    </FormGroup>
                );

            case "number":
                return (
                    <FormGroup
                        label={fieldConfig.label || fieldKey}
                        required={fieldConfig.required}
                    >
                        <NumberInput
                            {...commonProps}
                            min={fieldConfig.min}
                            max={fieldConfig.max}
                        />
                    </FormGroup>
                );

            case "boolean":
                return (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={item[fieldKey]}
                            onChange={(e) =>
                                updateItem(index, fieldKey, e.target.checked)
                            }
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            {fieldConfig.label || fieldKey}
                        </label>
                    </div>
                );

            default:
                return (
                    <FormGroup
                        label={fieldConfig.label || fieldKey}
                        required={fieldConfig.required}
                    >
                        <TextInput {...commonProps} />
                    </FormGroup>
                );
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {/* 並び替えボタン */}
                            <div className="flex flex-col gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveItem(index, -1)}
                                    disabled={index === 0}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 15l7-7 7 7"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveItem(index, 1)}
                                    disabled={index === items.length - 1}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {label} #{index + 1}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* フィールド */}
                    <div className="space-y-3 pl-2">
                        {Object.entries(itemsSchema).map(
                            ([fieldKey, fieldConfig]) => (
                                <div key={fieldKey}>
                                    {renderField(
                                        item,
                                        index,
                                        fieldKey,
                                        fieldConfig,
                                    )}
                                </div>
                            ),
                        )}
                    </div>
                </div>
            ))}

            {/* 追加ボタン */}
            <button
                type="button"
                onClick={addItem}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2 font-medium"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                {label}を追加
            </button>
        </div>
    );
}
