import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
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
                    <FormGroup>
                        <InputLabel htmlFor="event_date" required>
                            年月
                        </InputLabel>
                        <TextInput
                            id="event_date"
                            type="date"
                            value={data.event_date}
                            onChange={(e) =>
                                handleChange("event_date", e.target.value)
                            }
                            disabled={processing}
                        />
                        <InputError message={errors.event_date} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="title" required>
                            タイトル
                        </InputLabel>
                        <TextInput
                            id="title"
                            value={data.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                            disabled={processing}
                            placeholder="株式会社Smart Sprouts設立"
                        />
                        <InputError message={errors.title} />
                    </FormGroup>

                    <FormGroup>
                        <InputLabel htmlFor="description">説明</InputLabel>
                        <TextArea
                            id="description"
                            value={data.description || ""}
                            onChange={(e) =>
                                handleChange("description", e.target.value)
                            }
                            disabled={processing}
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </FormGroup>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                    表示設定
                </h3>
                <div className="space-y-4">
                    <FormGroup>
                        <InputLabel htmlFor="sort_order">表示順</InputLabel>
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
                        <InputError message={errors.sort_order} />
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
