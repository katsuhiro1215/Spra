import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardHeader } from "@/Components/Card";
import SearchBar from "@/Components/SearchBar";
import {
    BuildingOffice2Icon,
    UserIcon,
    ShieldCheckIcon,
    FolderIcon,
    DocumentTextIcon,
    DocumentCurrencyYenIcon,
    ReceiptPercentIcon,
    ChatBubbleLeftRightIcon,
    CalendarDaysIcon,
    WrenchScrewdriverIcon,
    MegaphoneIcon,
    TrophyIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { PageConfig } from "@/Constants/PageConfig";

const CATEGORY_ICONS = {
    companies: BuildingOffice2Icon,
    users: UserIcon,
    admins: ShieldCheckIcon,
    projects: FolderIcon,
    contracts: DocumentTextIcon,
    quotes: DocumentCurrencyYenIcon,
    invoices: ReceiptPercentIcon,
    contacts: ChatBubbleLeftRightIcon,
    appointments: CalendarDaysIcon,
    services: WrenchScrewdriverIcon,
    campaigns: MegaphoneIcon,
    membershipRanks: TrophyIcon,
};

export default function Index({ query = "", results = [], totalCount = 0 }) {
    const [keyword, setKeyword] = useState(query);

    const handleSearch = () => {
        router.get(
            route("admin.search"),
            { q: keyword },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={PageConfig.search.title}
                    description={PageConfig.search.description}
                    breadcrumbs={PageConfig.search.breadcrumbs}
                />
            }
        >
            <Head title={PageConfig.search.documentTitle} />

            <div className="w-full flex flex-col gap-4">
                <div className="max-w-md">
                    <SearchBar
                        value={keyword}
                        onChange={setKeyword}
                        onSearch={handleSearch}
                        placeholder="会社・顧客・プロジェクトなどを検索..."
                    />
                </div>

                {query === "" ? (
                    <Card className="text-center py-12">
                        <MagnifyingGlassIcon className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">
                            キーワードを入力して検索してください
                        </p>
                    </Card>
                ) : totalCount === 0 ? (
                    <Card className="text-center py-12">
                        <MagnifyingGlassIcon className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">
                            「{query}」に一致する結果は見つかりませんでした
                        </p>
                    </Card>
                ) : (
                    <>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            「{query}」の検索結果: {totalCount}件
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {results.map((category) => {
                                const Icon =
                                    CATEGORY_ICONS[category.key] ||
                                    DocumentTextIcon;

                                return (
                                    <Card key={category.key}>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                                {category.label}
                                                <span className="text-slate-400 dark:text-slate-500 font-normal">
                                                    ({category.total}件)
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {category.items.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={item.url}
                                                    className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                                >
                                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                                        {item.title || "(無題)"}
                                                    </div>
                                                    {item.subtitle && (
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                            {item.subtitle}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </AdminAuthenticatedLayout>
    );
}
