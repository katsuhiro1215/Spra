import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let idCounter = 0;

export default function ErDiagramView({ diagram }) {
    const containerRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!diagram) return;

        const isDark = document.documentElement.classList.contains("dark");
        mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? "dark" : "default",
            securityLevel: "strict",
        });

        let cancelled = false;
        idCounter += 1;
        const renderId = `er-diagram-${idCounter}`;

        mermaid
            .render(renderId, diagram)
            .then(({ svg }) => {
                if (!cancelled && containerRef.current) {
                    containerRef.current.innerHTML = svg;
                    setError(null);
                }
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || "ER図の描画に失敗しました");
            });

        return () => {
            cancelled = true;
        };
    }, [diagram]);

    if (!diagram) {
        return (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
                DBテーブル定義のセクションを追加すると、ここにER図が自動生成されます
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-red-600 dark:text-red-400 py-4">
                {error}
            </div>
        );
    }

    return <div ref={containerRef} className="overflow-x-auto" />;
}
