import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchFilters({ filters, handleSearch, handleReset }) {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                検索キーワード
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search || ""}
                                    placeholder="価格設定名、説明で検索..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                価格タイプ
                            </label>
                            <select
                                name="type"
                                defaultValue={filters.type || ""}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">すべて</option>
                                <option value="base">基本価格</option>
                                <option value="addon">追加オプション</option>
                                <option value="discount">割引価格</option>
                                <option value="tier">段階料金</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                課金タイプ
                            </label>
                            <select
                                name="billing_type"
                                defaultValue={filters.billing_type || ""}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">すべて</option>
                                <option value="fixed">固定料金</option>
                                <option value="per_unit">単位料金</option>
                                <option value="tiered">段階料金</option>
                                <option value="volume">ボリューム料金</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ステータス
                            </label>
                            <select
                                name="status"
                                defaultValue={filters.status || ""}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">すべて</option>
                                <option value="active">アクティブ</option>
                                <option value="inactive">非アクティブ</option>
                                <option value="visible">表示中</option>
                                <option value="hidden">非表示</option>
                                <option value="default">デフォルト</option>
                                <option value="featured">注目設定</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end items-center pt-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-md"
                            >
                                リセット
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                検索
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
