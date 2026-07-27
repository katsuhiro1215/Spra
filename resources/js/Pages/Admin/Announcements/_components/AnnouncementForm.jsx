import React from "react";
import {
    FormGroup,
    TextInput,
    TextArea,
    InputError,
    InputLabel,
    SelectInput,
} from "@/Components/Forms";

const AnnouncementForm = ({ data, setData, errors, processing, audiences }) => {
    const audienceOptions = Object.entries(audiences || {}).map(
        ([value, label]) => ({ value, label }),
    );

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                お知らせ内容
            </h3>
            <div className="space-y-4">
                <FormGroup>
                    <InputLabel htmlFor="title" required>
                        タイトル
                    </InputLabel>
                    <TextInput
                        id="title"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        disabled={processing}
                        placeholder="料金改定のお知らせ"
                    />
                    <InputError message={errors.title} />
                </FormGroup>

                <FormGroup>
                    <InputLabel htmlFor="audience" required>
                        配信対象
                    </InputLabel>
                    <SelectInput
                        id="audience"
                        value={data.audience || ""}
                        onChange={(e) => setData("audience", e.target.value)}
                        disabled={processing}
                        options={audienceOptions}
                    />
                    <InputError message={errors.audience} />
                </FormGroup>

                <FormGroup>
                    <InputLabel htmlFor="body" required>
                        本文
                    </InputLabel>
                    <TextArea
                        id="body"
                        value={data.body || ""}
                        onChange={(e) => setData("body", e.target.value)}
                        disabled={processing}
                        rows={10}
                        placeholder="お知らせの本文を入力してください"
                    />
                    <InputError message={errors.body} />
                </FormGroup>
            </div>
        </div>
    );
};

export default AnnouncementForm;
