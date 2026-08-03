import React from "react";
import { FormGroup, TextInput } from "@/Components/Forms";
import { Button, CrudButton } from "@/Components/Buttons";

export default function Form({ data, setData, errors, onSubmit, processing, submitLabel, cancelRoute }) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <FormGroup label="カテゴリ名" htmlFor="name" required error={errors.name}>
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
            </FormGroup>
            <FormGroup label="カラー" htmlFor="color" error={errors.color}>
                <input
                    id="color"
                    type="color"
                    value={data.color || "#4F46E5"}
                    onChange={(e) => setData("color", e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                />
            </FormGroup>
            <div className="flex items-center justify-end gap-4">
                <Button variant="secondary" href={route(cancelRoute)}>
                    キャンセル
                </Button>
                <CrudButton type="submit" action="store" loading={processing}>
                    {submitLabel}
                </CrudButton>
            </div>
        </form>
    );
}
