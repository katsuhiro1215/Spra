import React from "react";
import { BLOCK_REGISTRY } from "./registry";

/**
 * BlockEditorで作成された { blocks: [{ id, type, data }] } を
 * 公開サイト向けに読み取り専用で描画するコンポーネント。
 */
export default function BlockRenderer({ blocks }) {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {blocks.map((block) => {
                const definition = BLOCK_REGISTRY[block.type];
                if (!definition) return null;
                const Preview = definition.Preview;
                return <Preview key={block.id} data={block.data} />;
            })}
        </div>
    );
}
