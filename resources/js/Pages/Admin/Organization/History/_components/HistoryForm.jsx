import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    Toggle,
} from "@/Components/Forms";

const HistoryForm = ({ data, setData, errors, processing }) => {
    const handleChange = (field, value) => {
        setData(field, value);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    基本情報
                </h3>
                <div className="space-y-4">
                    <FormGroup
                        label="年月"
                        htmlFor="event_date"
                        required
                        error={errors.event_date}
                    >
                        <TextInput
                            id="event_date"
                            type="date"
                            value={data.event_date}
                            onChange={(e) =>
                                handleChange("event_date", e.target.value)
                            }
                            disabled={processing}
                        />
                    </FormGroup>

                    <FormGroup
                        label="タイトル"
                        htmlFor="title"
                        required
                        error={errors.title}
                    >
                        <TextInput
                            id="title"
                            value={data.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                            disabled={processing}
                            placeholder="株式会社Smart Sprouts設立"
                        />
                    </FormGroup>

                    <FormGroup
                        label="説明"
                        htmlFor="description"
                        error={errors.description}
                    >
                        <TextArea
                            id="description"
                            value={data.description || ""}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            disabled={processing}
                            rows={3}
                        />
                    </FormGroup>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    表示設定
                </h3>
                <div className="space-y-4">
                    <FormGroup
                        label="表示順"
                        htmlFor="sort_order"
                        error={errors.sort_order}
                    >
                        <TextInput
                            id="sort_order"
                            type="number"
                            value={data.sort_order}
                            onChange={(e) =>
                                handleChange("sort_order", e.target.value)
                            }
                            disabled={processing}
                            min="0"
                        />
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            小さい順に表示されます
                        </p>
                    </FormGroup>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                公開
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Webサイトに表示する
                            </p>
                        </div>
                        <Toggle
                            enabled={data.is_published}
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

export default HistoryForm;
