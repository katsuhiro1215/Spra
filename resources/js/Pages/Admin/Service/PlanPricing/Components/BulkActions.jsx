import { TrashIcon } from "@heroicons/react/24/outline";

export default function BulkActions({
    selectedItems,
    handleBulkDelete,
    isProcessing,
}) {
    if (selectedItems.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                    {selectedItems.length}件の項目が選択されています
                </div>
                <button
                    type="button"
                    onClick={handleBulkDelete}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    選択項目を削除 ({selectedItems.length})
                </button>
            </div>
        </div>
    );
}
