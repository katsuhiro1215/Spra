import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function EditException({ auth, exception }) {
    const { data, setData, put, processing, errors } = useForm({
        exception_date: exception.exception_date,
        is_open: exception.is_open,
        open_time: exception.open_time || "09:00",
        close_time: exception.close_time || "18:00",
        break_start: exception.break_start || "12:00",
        break_end: exception.break_end || "13:00",
        reason: exception.reason || "",
        notes: exception.notes || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.schedules.exceptions.update", exception.id));
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.exceptions.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.schedules.exceptions.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.exceptions.breadcrumbs,
        PageConfig.exceptions.pages.edit.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.exceptions.pages.edit.title}
                    description={PageConfig.exceptions.pages.edit.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="例外日の編集" />

            <div className="max-w-4xl">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* 日付 */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        日付{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.exception_date}
                                        onChange={(e) =>
                                            setData(
                                                "exception_date",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        required
                                    />
                                    {errors.exception_date && (
                                        <div className="text-red-600 text-sm mt-1">
                                            {errors.exception_date}
                                        </div>
                                    )}
                                </div>

                                {/* 営業するか */}
                                <div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_open}
                                            onChange={(e) =>
                                                setData(
                                                    "is_open",
                                                    e.target.checked,
                                                )
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium">
                                            営業する
                                        </span>
                                    </label>
                                </div>

                                {/* 営業時間（営業する場合のみ） */}
                                {data.is_open && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                営業時間
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="time"
                                                    value={data.open_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            "open_time",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                />
                                                <span>〜</span>
                                                <input
                                                    type="time"
                                                    value={data.close_time}
                                                    onChange={(e) =>
                                                        setData(
                                                            "close_time",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                休憩時間
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="time"
                                                    value={data.break_start}
                                                    onChange={(e) =>
                                                        setData(
                                                            "break_start",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                />
                                                <span>〜</span>
                                                <input
                                                    type="time"
                                                    value={data.break_end}
                                                    onChange={(e) =>
                                                        setData(
                                                            "break_end",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* 理由 */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        理由
                                    </label>
                                    <input
                                        type="text"
                                        value={data.reason}
                                        onChange={(e) =>
                                            setData("reason", e.target.value)
                                        }
                                        placeholder="例: 臨時休業、年末年始、特別営業"
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                </div>

                                {/* 備考 */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        備考
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        rows="3"
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <Link
                                    href={route(
                                        "admin.schedules.exceptions.index",
                                    )}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    キャンセル
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    更新
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
