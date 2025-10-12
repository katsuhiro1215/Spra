// 使用例1: ユーザー管理画面
import PageHeader from "@/Components/PageHeader";
import {
    PlusIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// 複数アクションのある管理画面
const UsersIndex = () => {
    const headerActions = [
        {
            label: "設定",
            icon: Cog6ToothIcon,
            variant: "secondary",
            route: route("admin.users.settings"),
        },
        {
            label: "Export",
            icon: ArrowDownTrayIcon,
            variant: "secondary",
            onClick: () => exportUsers(),
        },
        {
            label: "Import",
            icon: ArrowUpTrayIcon,
            variant: "secondary",
            route: route("admin.users.import"),
        },
        {
            label: "新規ユーザー",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.users.create"),
        },
    ];

    return (
        <AdminLayout>
            <PageHeader
                title="ユーザー管理"
                description="システムユーザーの作成・編集・権限管理を行います"
                actions={headerActions}
            />
            {/* ... */}
        </AdminLayout>
    );
};

// 使用例2: 注文管理画面
const OrdersIndex = () => {
    const headerActions = [
        {
            label: "レポート出力",
            icon: ArrowDownTrayIcon,
            variant: "success",
            onClick: () => generateReport(),
        },
        {
            label: "手動注文作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.orders.create"),
        },
    ];

    return (
        <AdminLayout>
            <PageHeader
                title="注文管理"
                description="注文の確認・ステータス管理・配送管理を行います"
                actions={headerActions}
            />
            {/* ... */}
        </AdminLayout>
    );
};

// 使用例3: シンプルな設定画面（アクションなし）
const SettingsIndex = () => {
    return (
        <AdminLayout>
            <PageHeader
                title="システム設定"
                description="アプリケーションの基本設定を管理します"
                // actions={[]} // アクションなし
            />
            {/* ... */}
        </AdminLayout>
    );
};

export { UsersIndex, OrdersIndex, SettingsIndex };
