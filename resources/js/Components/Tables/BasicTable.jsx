import { forwardRef } from "react";

/**
 * BasicTable
 * シンプルなスタイル付きのテーブルコンポーネント
 * 
 * @param {React.ReactNode} children - <thead> と <tbody> を含む内容
 * @param {string} className - 追加のクラス名
 */
const BasicTable = forwardRef(({ children, className = "", ...props }, ref) => {
    return (
        <div className="overflow-x-auto">
            <table
                ref={ref}
                className={`min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-sm ${className}`}
                {...props}
            >
                {children}
            </table>
        </div>
    );
});

export default BasicTable;
