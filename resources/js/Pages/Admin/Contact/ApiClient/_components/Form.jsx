import React from "react";
import { useForm } from "@inertiajs/react";
// Components
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { FormGroup, TextInput, InputError } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";

const Form = ({ client = null, isEditing = false }) => {
    const { data, setData, post, put, processing, errors } = useForm({
        name: client?.name || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && client) {
            put(route("admin.contact.api-client.update", client.id), {
                preserveScroll: true,
            });
        } else {
            post(route("admin.contact.api-client.store"), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                {isEditing ? "APIクライアントを編集" : "新しいAPIクライアントを作成"}
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormGroup>
                        <TextInput
                            label="連携先名"
                            placeholder="例: 公式サイト(WordPress)"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </FormGroup>

                    {!isEditing && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            作成すると、APIキーとWordPress貼り付け用のスニペットが一度だけ表示されます。
                        </p>
                    )}

                    <div className="flex gap-3 pt-6">
                        <PrimaryButton type="submit" disabled={processing}>
                            {isEditing ? "更新" : "作成"}
                        </PrimaryButton>
                        <SecondaryButton
                            type="button"
                            href={route("admin.contact.api-client.index")}
                            disabled={processing}
                        >
                            キャンセル
                        </SecondaryButton>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
};

export default Form;
