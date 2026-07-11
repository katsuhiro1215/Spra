import React from "react";
import { BLOCK_REGISTRY } from "./registry";

/**
 * ブロック配列を読み取り専用でレンダリングする（Page/Post Showページやフロント表示で使用）。
 */
export default function BlockPreview({ value, className = "" }) {
    const blocks = Array.isArray(value?.blocks) ? value.blocks : [];

    if (blocks.length === 0) {
        return <p className="text-sm text-slate-400">コンテンツが設定されていません</p>;
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {blocks.map((block) => {
                const definition = BLOCK_REGISTRY[block.type];
                if (!definition) return null;
                const Preview = definition.Preview;
                return <Preview key={block.id} data={block.data} />;
            })}
        </div>
    );
}
