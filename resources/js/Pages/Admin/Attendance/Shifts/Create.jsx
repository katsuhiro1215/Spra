import { Head, Link, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import { InputLabel, TextInput, TextArea, InputError } from "@/Components/Forms";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function ShiftsCreate({ admins }) {
    const { data, setData, post, processing, errors } = useForm({
        admin_id: "",
        shift_date: "",
        start_time: "",
        end_time: "",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.attendance.shifts.store"));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="シフト作成"
                    description="管理者の勤務予定を登録します"
                    actions={[
                        {
                            label: "戻る",
                            icon: ArrowLeftIcon,
                            variant: "secondary",
                            route: route("admin.attendance.shifts.index"),
                        },
                    ]}
                    breadcrumbs={[
                        ...PageConfig.attendance.breadcrumbs,
                        "シフト管理",
                        "新規作成",
                    ]}
                />
            }
        >
            <Head title="シフト作成" />
            <FlashMessage />

            <div className="w-full sm:max-w-7xl lg:max-w-4xl">
                <Card>
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="admin_id"
                                value="担当者 *"
                                required
                            />
                            <select
                                id="admin_id"
                                value={data.admin_id}
                                onChange={(e) =>
                                    setData("admin_id", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">選択してください</option>
                                {admins.map((admin) => (
                                    <option
                                        key={admin.value}
                                        value={admin.value}
                                    >
                                        {admin.label}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.admin_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="shift_date"
                                value="シフト日 *"
                                required
                            />
                            <TextInput
                                id="shift_date"
                                type="date"
                                value={data.shift_date}
                                onChange={(e) =>
                                    setData("shift_date", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.shift_date}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="start_time"
                                    value="開始予定時刻 *"
                                    required
                                />
                                <TextInput
                                    id="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) =>
                                        setData("start_time", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.start_time}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="end_time"
                                    value="終了予定時刻 *"
                                    required
                                />
                                <TextInput
                                    id="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) =>
                                        setData("end_time", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError
                                    message={errors.end_time}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="メモ" />
                            <TextArea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                rows={4}
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.notes}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link href={route("admin.attendance.shifts.index")}>
                                <SecondaryButton type="button">
                                    キャンセル
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                作成する
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
