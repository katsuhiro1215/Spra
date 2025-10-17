import { Profiler, useRef, useEffect } from "react";

/**
 * パフォーマンス測定用のProfilerコンポーネント
 * 開発環境でのみコンポーネントのレンダリング時間を測定
 */
export const PerformanceProfiler = ({ id, children, onRender }) => {
    const handleRender = (
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions
    ) => {
        // 開発環境でのみログ出力
        if (process.env.NODE_ENV === "development") {
            console.group(`🔍 Performance: ${id}`);
            console.log(`Phase: ${phase}`);
            console.log(`Actual Duration: ${actualDuration.toFixed(2)}ms`);
            console.log(`Base Duration: ${baseDuration.toFixed(2)}ms`);
            console.log(`Start Time: ${startTime.toFixed(2)}ms`);
            console.log(`Commit Time: ${commitTime.toFixed(2)}ms`);
            console.groupEnd();
        }

        // カスタムハンドラーがあれば実行
        if (onRender) {
            onRender(
                id,
                phase,
                actualDuration,
                baseDuration,
                startTime,
                commitTime,
                interactions
            );
        }
    };

    return (
        <Profiler id={id} onRender={handleRender}>
            {children}
        </Profiler>
    );
};

/**
 * HOC形式でパフォーマンス測定を追加
 */
export const withPerformanceProfiler = (WrappedComponent, profileId) => {
    return (props) => (
        <PerformanceProfiler id={profileId || WrappedComponent.name}>
            <WrappedComponent {...props} />
        </PerformanceProfiler>
    );
};

/**
 * カスタムフックでレンダリング回数をカウント
 */
export const useRenderCount = (componentName) => {
    const renderCount = useRef(0);

    useEffect(() => {
        renderCount.current += 1;
        if (process.env.NODE_ENV === "development") {
            console.log(
                `🔄 ${componentName} rendered ${renderCount.current} times`
            );
        }
    });

    return renderCount.current;
};

/**
 * メモリ使用量を監視するフック
 */
export const useMemoryMonitor = (componentName) => {
    useEffect(() => {
        if (process.env.NODE_ENV === "development" && "memory" in performance) {
            const memory = performance.memory;
            console.log(`💾 ${componentName} Memory:`, {
                used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
                total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
                limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
            });
        }
    });
};

// 使用例:
//
// // Profilerでラップ
// <PerformanceProfiler id="ServiceTypeForm">
//     <ServiceTypeForm />
// </PerformanceProfiler>
//
// // HOCとして使用
// export default withPerformanceProfiler(ServiceTypeForm, 'ServiceTypeForm');
//
// // フック内で使用
// const MyComponent = () => {
//     const renderCount = useRenderCount('MyComponent');
//     useMemoryMonitor('MyComponent');
//
//     return <div>Rendered {renderCount} times</div>;
// };
