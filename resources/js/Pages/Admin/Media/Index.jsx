import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import MediaTable from "@/Components/MediaTable";
import SearchBar from "@/Components/SearchBar";
import FilterSelect from "@/Components/FilterSelect";
import CreateMediaModal from "@/Components/Media/CreateMediaModal";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function Index({ mediaList, filters, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [typeFilter, setTypeFilter] = useState(filters.type || "");
    const [usageTypeFilter, setUsageTypeFilter] = useState(
        filters.usage_type || "",
    );
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleFilter = () => {
        router.get(
            route("admin.media.index"),
            {
                search,
                type: typeFilter,
                usage_type: usageTypeFilter,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDelete = (media) => {
        if (confirm(`「${media.title}」を削除してもよろしいですか？`)) {
            router.delete(route("admin.media.destroy", media.id));
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
        );
    };

    const headerActions = [
        {
            label: "アップロード",
            icon: PlusIcon,
            variant: "primary",
            onClick: () => setShowCreateModal(true),
        },
    ];

    const typeOptions = [
        { value: "image", label: "画像" },
        { value: "video", label: "動画" },
        { value: "3d_model", label: "3Dモデル" },
    ];

    const usageTypeOptions = [
        { value: "profile", label: "プロフィール画像" },
        { value: "admin_profile", label: "Adminプロフィール" },
        { value: "user_profile", label: "Userプロフィール" },
        { value: "unused", label: "未使用" },
    ];

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="メディア管理"
                    description="画像、動画、その他のメディアファイルを管理"
                    actions={headerActions}
                />
            }
        >
            <Head title="メディア管理" />
            <FlashMessage />

            <div className="w-full flex flex-col gap-4">
                {/* 統計情報 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            総ファイル数
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                            {stats.total}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            画像
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                            {stats.images}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            プロフィール画像
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                            {stats.profile_images}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            合計サイズ
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                            {formatFileSize(stats.total_size)}
                        </div>
                    </div>
                </div>

                {/* 検索とフィルター */}
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4">
                        <div className="flex-1">
                            <SearchBar
                                value={search}
                                onChange={(value) => setSearch(value)}
                                onSearch={handleFilter}
                                placeholder="ファイル名、タイトル、説明で検索..."
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <FunnelIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                フィルター
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FilterSelect
                                label="タイプ"
                                value={typeFilter}
                                onChange={(value) => setTypeFilter(value)}
                                options={typeOptions}
                                placeholder="すべてのタイプ"
                            />
                            <FilterSelect
                                label="使用状況"
                                value={usageTypeFilter}
                                onChange={(value) => setUsageTypeFilter(value)}
                                options={usageTypeOptions}
                                placeholder="すべて"
                            />
                        </div>
                    </div>
                </div>

                {/* メディアグリッド */}
                <MediaTable mediaList={mediaList} onDelete={handleDelete} />
            </div>

            {/* アップロードモーダル */}
            <CreateMediaModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </AdminAuthenticatedLayout>
    );
}
