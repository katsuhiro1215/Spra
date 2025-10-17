import React from "react";
import { TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ServiceTypesBulkActions = ({
    selectedItems,
    bulkAction,
    setBulkAction,
    onBulkAction,
    serviceTypesCount,
}) => {
    const handleBulkActionChange = (action) => {
        setBulkAction(action);
        if (action && selectedItems.length > 0) {
            onBulkAction(action);
        }
    };

    if (selectedItems.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-sm text-blue-700">
                        {selectedItems.length} 件選択中
                        {selectedItems.length === serviceTypesCount &&
                            " (全件)"}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleBulkActionChange("activate")}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
                    >
                        <CheckIcon className="w-3 h-3 mr-1" />
                        アクティブ化
                    </button>
                    <button
                        onClick={() => handleBulkActionChange("deactivate")}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                        <XMarkIcon className="w-3 h-3 mr-1" />
                        非アクティブ化
                    </button>
                    <button
                        onClick={() => handleBulkActionChange("delete")}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                    >
                        <TrashIcon className="w-3 h-3 mr-1" />
                        削除
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceTypesBulkActions;
