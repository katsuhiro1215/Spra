import Dropdown from "@/Components/Layout/Dropdown";
import SecondaryButton from "@/Components/Buttons/SecondaryButton";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

/**
 * 一覧画面の現在のフィルター条件を引き継いでExcel/CSVをダウンロードするボタン。
 * ファイルダウンロードはブラウザの通常ナビゲーションで行う必要があるため、
 * Inertiaの<Link>ではなく実際の<a href>タグを使用する。
 */
export default function ExportMenu({ routeName, filters = {} }) {
    const buildUrl = (format) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, value);
            }
        });
        params.set("format", format);
        return `${route(routeName)}?${params.toString()}`;
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <SecondaryButton
                    type="button"
                    icon={ArrowDownTrayIcon}
                    className="relative"
                >
                    エクスポート
                </SecondaryButton>
            </Dropdown.Trigger>
            <Dropdown.Content align="right" width="48">
                <a
                    href={buildUrl("xlsx")}
                    className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Excel形式（.xlsx）
                </a>
                <a
                    href={buildUrl("csv")}
                    className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    CSV形式（.csv）
                </a>
            </Dropdown.Content>
        </Dropdown>
    );
}
