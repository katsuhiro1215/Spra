import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
    SelectInput,
    Checkbox,
    Toggle,
} from "@/Components/Forms";
import * as validation from "./validation";

const FaqForm = ({
    data,
    setData,
    errors,
    localErrors,
    setLocalErrors,
    processing,
    categories,
    services,
}) => {
    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "faq_category_id":
                validation.validateFaqCategoryId(tempData);
                break;
            case "question":
                validation.validateQuestion(tempData);
                break;
            case "answer":
                validation.validateAnswer(tempData);
                break;
            case "sort_order":
                validation.validateSortOrder(tempData);
                break;
        }

        setLocalErrors((prev) => ({
            ...prev,
            [fieldName]: tempData.errors[fieldName],
        }));
    };

    const handleChange = (field, value) => {
        setData(field, value);
        if (localErrors[field]) {
            setLocalErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const toggleService = (serviceId) => {
        const current = data.service_ids || [];
        const next = current.includes(serviceId)
            ? current.filter((id) => id !== serviceId)
            : [...current, serviceId];
        handleChange("service_ids", next);
    };

    const categoryOptions = [
        { value: "", label: "カテゴリを選択" },
        ...(categories || []).map((cat) => ({
            value: cat.id,
            label: cat.name,
        })),
    ];

    return (
        <div className="space-y-6">
            {/* 基本情報 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    基本情報
                </h3>
                <div className="space-y-4">
                    <FormGroup>
                        <InputLabel htmlFor="faq_category_id" required>
                            カテゴリ
                        </InputLabel>
                        <SelectInput
                            id="faq_category_id"
                            value={data.faq_category_id || ""}
                            onChange={(e) =>
                                handleChange(
                                    "faq_category_id",
                                    e.target.value,
                                )
                            }
                            onBlur={() => handleBlur("faq_category_id")}
                            disabled={processing}
                            options={categoryOptions}
                        />
                        <InputError
                            message={
                                localErrors.faq_category_id ||
                                errors.faq_category_id
                            }
                        />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="question" required>
                            質問
                        </InputLabel>
                        <TextInput
                            id="question"
                            value={data.question}
                            onChange={(e) =>
                                handleChange("question", e.target.value)
                            }
                            onBlur={() => handleBlur("question")}
                            disabled={processing}
                            placeholder="料金体系はどうなっていますか?"
                        />
                        <InputError
                            message={localErrors.question || errors.question}
                        />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="answer" required>
                            回答
                        </InputLabel>
                        <TextArea
                            id="answer"
                            value={data.answer || ""}
                            onChange={(e) =>
                                handleChange("answer", e.target.value)
                            }
                            onBlur={() => handleBlur("answer")}
                            disabled={processing}
                            rows={6}
                            placeholder="回答を入力..."
                        />
                        <InputError
                            message={localErrors.answer || errors.answer}
                        />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="sort_order">表示順</InputLabel>
                        <TextInput
                            id="sort_order"
                            type="number"
                            value={data.sort_order || ""}
                            onChange={(e) =>
                                handleChange("sort_order", e.target.value)
                            }
                            onBlur={() => handleBlur("sort_order")}
                            disabled={processing}
                            placeholder="0"
                            min="0"
                        />
                        <InputError
                            message={
                                localErrors.sort_order || errors.sort_order
                            }
                        />
                    </FormGroup>
                </div>
            </div>

            {/* 対象サービス */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                    対象サービス
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    選択したサービスの詳細ページにこのFAQを表示します（未選択の場合はFAQページにのみ表示）
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(services || []).map((service) => (
                        <Checkbox
                            key={service.id}
                            id={`service-${service.id}`}
                            label={service.name}
                            checked={(data.service_ids || []).includes(
                                service.id,
                            )}
                            onChange={() => toggleService(service.id)}
                            disabled={processing}
                        />
                    ))}
                </div>
            </div>

            {/* 設定 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    設定
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                よくある質問として表示
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                注目のFAQとして優先表示する
                            </p>
                        </div>
                        <Toggle
                            enabled={data.is_featured ?? false}
                            onChange={(value) =>
                                handleChange("is_featured", value)
                            }
                            disabled={processing}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                公開
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Webサイトに公開する
                            </p>
                        </div>
                        <Toggle
                            enabled={data.is_published ?? true}
                            onChange={(value) =>
                                handleChange("is_published", value)
                            }
                            disabled={processing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqForm;
