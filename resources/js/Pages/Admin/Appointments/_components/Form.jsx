import React, { useState } from "react";
import { Card, CardTitle, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    SelectInput,
    NumberInput,
    Checkbox,
    InputError,
} from "@/Components/Forms";
import { StoreButton, SecondaryButton } from "@/Components/Buttons";
import * as validation from "./validation";

const AppointmentForm = ({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    cancelRoute,
    isEdit = false,
}) => {
    const [localErrors, setLocalErrors] = useState({});

    const handleBlur = (fieldName) => {
        const tempData = { ...data, errors: {} };

        switch (fieldName) {
            case "appointment_slot_id":
                validation.validateAppointmentSlotId(tempData);
                break;
            case "company_id":
                validation.validateCompanyId(tempData);
                break;
            case "project_id":
                validation.validateProjectId(tempData);
                break;
            case "title":
                validation.validateTitle(tempData);
                break;
            case "description":
                validation.validateDescription(tempData);
                break;
            case "client_notes":
                validation.validateClientNotes(tempData);
                break;
        }

        setLocalErrors((prev) => ({
            ...prev,
            [fieldName]: tempData.errors[fieldName],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>予約情報</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 予約枠 */}
                        <FormGroup
                            label="予約枠 *"
                            htmlFor="appointment_slot_id"
                            required
                            help="予約が属する枠を選択してください。"
                        >
                            <SelectInput
                                id="appointment_slot_id"
                                value={data.appointment_slot_id}
                                onChange={(e) =>
                                    setData(
                                        "appointment_slot_id",
                                        e.target.value,
                                    )
                                }
                                onBlur={() => handleBlur("appointment_slot_id")}
                            >
                                <option value="">
                                    予約枠を選択してください
                                </option>
                                {availableSlots.map((slot) => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.label}
                                    </option>
                                ))}
                            </SelectInput>
                            {selectedSlot && selectedSlot.assigned_admin && (
                                <p className="mt-1 text-sm text-gray-500">
                                    担当者: {selectedSlot.assigned_admin.name}
                                </p>
                            )}
                            <InputError
                                message={
                                    errors.appointment_slot_id ||
                                    localErrors.appointment_slot_id
                                }
                            />
                        </FormGroup>

                        {/* 企業選択 */}
                        <FormGroup
                            label="企業 *"
                            htmlFor="company_id"
                            required
                            help="予約が属する企業を選択してください。"
                        >
                            <SelectInput
                                id="company_id"
                                value={data.company_id}
                                onChange={(e) =>
                                    setData("company_id", e.target.value)
                                }
                                onBlur={() => handleBlur("company_id")}
                            >
                                <option value="">企業を選択してください</option>
                                {availableCompanies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                message={
                                    errors.company_id || localErrors.company_id
                                }
                            />
                        </FormGroup>

                        {/* プロジェクト選択 */}
                        <FormGroup
                            label="プロジェクト"
                            htmlFor="project_id"
                            help="予約が属するプロジェクトを選択してください。"
                        >
                            <SelectInput
                                id="project_id"
                                value={data.project_id}
                                onChange={(e) =>
                                    setData("project_id", e.target.value)
                                }
                                onBlur={() => handleBlur("project_id")}
                            >
                                <option value="">
                                    プロジェクトを選択してください
                                </option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.title}
                                    </option>
                                ))}
                            </SelectInput>
                            {!data.company_id && (
                                <p className="mt-1 text-sm text-gray-500">
                                    企業を選択するとプロジェクトが表示されます
                                </p>
                            )}
                            <InputError
                                message={
                                    errors.project_id || localErrors.project_id
                                }
                            />
                        </FormGroup>

                        {/* 件名 */}
                        <FormGroup
                            label="件名"
                            htmlFor="subject"
                            required
                            help="件名を入力してください"
                        >
                            <TextInput
                                id="subject"
                                value={data.subject}
                                onChange={(e) =>
                                    setData("subject", e.target.value)
                                }
                                onBlur={() => handleBlur("subject")}
                                placeholder="例: プロジェクト進捗会、初回打ち合わせ"
                                required
                            />
                            <InputError
                                message={errors.subject || localErrors.subject}
                            />
                        </FormGroup>

                        {/* 詳細説明 */}
                        <FormGroup label="詳細説明" className="md:col-span-2">
                            <TextArea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                onBlur={() => handleBlur("description")}
                                placeholder="予約に関する詳細情報を記入してください"
                            />
                            <InputError
                                message={
                                    errors.description ||
                                    localErrors.description
                                }
                            />
                        </FormGroup>

                        {/* クライアント向けメモ */}
                        <FormGroup
                            label="クライアント向けメモ"
                            className="md:col-span-2"
                        >
                            <TextArea
                                id="client_notes"
                                rows={6}
                                value={data.client_notes || ""}
                                onChange={(e) =>
                                    setData("client_notes", e.target.value)
                                }
                                onBlur={() => handleBlur("client_notes")}
                                placeholder="クライアントと共有するメモや注意事項を入力してください"
                            />
                            <InputError
                                message={
                                    errors.client_notes ||
                                    localErrors.client_notes
                                }
                            />
                        </FormGroup>

                        {/* リマインダー送信 */}
                        <div className="flex items-center">
                            <input
                                id="send_reminder"
                                type="checkbox"
                                checked={data.send_reminder}
                                onChange={(e) =>
                                    setData("send_reminder", e.target.checked)
                                }
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <InputLabel
                                htmlFor="send_reminder"
                                value="予約のリマインダーを送信する"
                                className="ml-2 mb-0"
                            />
                        </div>
                        <InputError
                            message={errors.send_reminder}
                            className="mt-2"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* アクションボタン */}
            <div className="flex items-center justify-end gap-4">
                <SecondaryButton href={cancelRoute} size="md">
                    キャンセル
                </SecondaryButton>
                <StoreButton
                    type="submit"
                    disabled={processing}
                    loading={processing}
                    size="md"
                >
                    {processing
                        ? isEdit
                            ? "更新中..."
                            : "作成中..."
                        : isEdit
                          ? "更新"
                          : "作成"}
                </StoreButton>
            </div>
        </form>
    );
};

export default AppointmentForm;
