import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { InputLabel, TextInput, TextArea, InputError } from "@/Components/Forms";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

function toTimeInputValue(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
    ).padStart(2, "0")}`;
}

export default function RecordsEdit({ record }) {
    const { data, setData, put, processing, errors } = useForm({
        clocked_in_at: toTimeInputValue(record.clocked_in_at),
        clocked_out_at: toTimeInputValue(record.clocked_out_at),
        status: record.status,
        notes: record.notes || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.attendance.records.update", record.id));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="勤怠記録の修正"
                    description={`${record.work_date} / ${
                        record.admin?.profile?.full_name || record.admin?.email
                    }`}
                    actions={[
                        {
                            label: "戻る",
                            icon: ArrowLeftIcon,
                            variant: "secondary",
                            route: route("admin.attendance.records.index"),
                        },
                    ]}
                    breadcrumbs={[
                        ...PageConfig.attendance.breadcrumbs,
                        "出退勤記録",
                        "修正",
                    ]}
                />
            }
        >
            <Head title="勤怠記録の修正" />
            <FlashMessage />

            <div className="w-full sm:max-w-7xl lg:max-w-4xl">
                <Card>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="clocked_in_at"
                                    value="出勤時刻"
                                />
                                <TextInput
                                    id="clocked_in_at"
                                    type="time"
                                    value={data.clocked_in_at}
                                    onChange={(e) =>
                                        setData(
                                            "clocked_in_at",
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.clocked_in_at}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="clocked_out_at"
                                    value="退勤時刻"
                                />
                                <TextInput
                                    id="clocked_out_at"
                                    type="time"
                                    value={data.clocked_out_at}
                                    onChange={(e) =>
                                        setData(
                                            "clocked_out_at",
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.clocked_out_at}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="status"
                                value="ステータス *"
                                required
                            />
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="working">勤務中</option>
                                <option value="finished">退勤済み</option>
                            </select>
                            <InputError
                                message={errors.status}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="notes"
                                value="修正理由・備考"
                            />
                            <TextArea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                rows={4}
                                className="mt-1 block w-full"
                                placeholder="手動で修正した理由があれば記入してください"
                            />
                            <InputError
                                message={errors.notes}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={route(
                                    "admin.attendance.records.index",
                                )}
                            >
                                <SecondaryButton type="button">
                                    キャンセル
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                更新する
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
