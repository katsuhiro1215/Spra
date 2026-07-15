import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

export default function CreateHoliday({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        date: "",
        name: "",
        type: "national",
        color: "#ff0000",
        is_recurring: false,
        description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.schedules.holidays.store"));
    };

    // ========================================
    // Constants - Header Actions
    // ========================================
    const headerActions = [
        {
            label: PageConfig.holidays.actions.back,
            icon: ArrowLeftIcon,
            variant: "ghost",
            route: route("admin.schedules.holidays.index"),
        },
    ];

    // ========================================
    // Constants - Breadcrumbs
    // ========================================
    const breadcrumbs = [
        ...PageConfig.holidays.breadcrumbs,
        PageConfig.holidays.pages.create.breadcrumb,
    ];

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <PageHeader
                    title={PageConfig.holidays.pages.create.title}
                    description={PageConfig.holidays.pages.create.description}
                    actions={headerActions}
                    breadcrumbs={breadcrumbs}
                />
            }
        >
            <Head title="祝日の追加" />

            {/* フラッシュメッセージ */}
            <FlashMessage />

            <div className="max-w-4xl">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                    {/* 日付 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            日付{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) =>
                                                setData("date", e.target.value)
                                            }
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            required
                                        />
                                        {errors.date && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.date}
                                            </div>
                                        )}
                                    </div>

                                    {/* 祝日名 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            祝日名{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="例: 元日、成人の日"
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* 種類 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            種類
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) =>
                                                setData("type", e.target.value)
                                            }
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="national">
                                                国民の祝日
                                            </option>
                                            <option value="international">
                                                国際的な祝日
                                            </option>
                                        </select>
                                    </div>

                                    {/* カラー */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            カラー（カレンダー表示用）
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="color"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        "color",
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-10 w-20 border-gray-300 dark:border-gray-700 rounded-md"
                                            />
                                            <input
                                                type="text"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        "color",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="#ff0000"
                                                className="flex-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* 毎年繰り返し */}
                                    <div>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_recurring}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_recurring",
                                                        e.target.checked,
                                                    )
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            <span className="ms-3 text-sm font-medium">
                                                毎年繰り返す
                                            </span>
                                        </label>
                                    </div>

                                    {/* 説明 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            説明
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            rows="3"
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <Link
                                        href={route(
                                            "admin.schedules.holidays.index",
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
                                        登録
                                    </button>
                                </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
