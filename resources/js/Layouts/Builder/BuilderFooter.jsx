export default function BuilderFooter() {
    return (
        <footer className="bg-gray-800 text-gray-300 text-xs px-4 py-2 border-t border-gray-700 relative z-30">
            <div className="flex items-center justify-between">
                {/* 左側：ステータス情報 */}
                <div className="flex items-center space-x-4">
                    <span>
                        <span className="text-gray-400">タスク:</span>{" "}
                        <span className="text-white font-medium">0</span>
                    </span>
                    <span className="text-gray-600">|</span>
                    <span>
                        <span className="text-gray-400">選択中:</span>{" "}
                        <span className="text-white font-medium">なし</span>
                    </span>
                </div>

                {/* 中央：進捗情報 */}
                <div className="text-gray-400">
                    進捗率: <span className="text-white">0%</span>
                </div>

                {/* 右側：最終更新など */}
                <div className="text-gray-400">
                    最終保存: <span className="text-white">未保存</span>
                </div>
            </div>
        </footer>
    );
}
