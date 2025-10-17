import { useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * 配列データ入力用の汎用コンポーネント
 * 特徴、対象顧客、成果物、技術などで再利用
 */
const ArrayInputSection = ({
    title,
    items = [],
    onAdd,
    onRemove,
    placeholder = "入力してください",
    badgeColorClass = "bg-blue-100 text-blue-800",
}) => {
    const [input, setInput] = useState("");

    const handleAdd = () => {
        if (input.trim()) {
            onAdd(input.trim());
            setInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {title}
                </h3>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={placeholder}
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {items.map((item, index) => (
                            <span
                                key={index}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${badgeColorClass}`}
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => onRemove(index)}
                                    className="ml-2 hover:opacity-75"
                                >
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArrayInputSection;
