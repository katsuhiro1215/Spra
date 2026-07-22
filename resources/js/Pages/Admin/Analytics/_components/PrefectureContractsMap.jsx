import { useEffect, useMemo, useState } from "react";
import { JapanMap } from "japanmap";
import { Card, CardHeader, CardBody } from "@/Components/Card";

// ISO 3166-2:JP順（japanmap パッケージの内部データと同じ並び）
const JAPAN_PREFECTURES = [
    { id: "JP01", name: "北海道" },
    { id: "JP02", name: "青森県" },
    { id: "JP03", name: "岩手県" },
    { id: "JP04", name: "宮城県" },
    { id: "JP05", name: "秋田県" },
    { id: "JP06", name: "山形県" },
    { id: "JP07", name: "福島県" },
    { id: "JP08", name: "茨城県" },
    { id: "JP09", name: "栃木県" },
    { id: "JP10", name: "群馬県" },
    { id: "JP11", name: "埼玉県" },
    { id: "JP12", name: "千葉県" },
    { id: "JP13", name: "東京都" },
    { id: "JP14", name: "神奈川県" },
    { id: "JP15", name: "新潟県" },
    { id: "JP16", name: "富山県" },
    { id: "JP17", name: "石川県" },
    { id: "JP18", name: "福井県" },
    { id: "JP19", name: "山梨県" },
    { id: "JP20", name: "長野県" },
    { id: "JP21", name: "岐阜県" },
    { id: "JP22", name: "静岡県" },
    { id: "JP23", name: "愛知県" },
    { id: "JP24", name: "三重県" },
    { id: "JP25", name: "滋賀県" },
    { id: "JP26", name: "京都府" },
    { id: "JP27", name: "大阪府" },
    { id: "JP28", name: "兵庫県" },
    { id: "JP29", name: "奈良県" },
    { id: "JP30", name: "和歌山県" },
    { id: "JP31", name: "鳥取県" },
    { id: "JP32", name: "島根県" },
    { id: "JP33", name: "岡山県" },
    { id: "JP34", name: "広島県" },
    { id: "JP35", name: "山口県" },
    { id: "JP36", name: "徳島県" },
    { id: "JP37", name: "香川県" },
    { id: "JP38", name: "愛媛県" },
    { id: "JP39", name: "高知県" },
    { id: "JP40", name: "福岡県" },
    { id: "JP41", name: "佐賀県" },
    { id: "JP42", name: "長崎県" },
    { id: "JP43", name: "熊本県" },
    { id: "JP44", name: "大分県" },
    { id: "JP45", name: "宮崎県" },
    { id: "JP46", name: "鹿児島県" },
    { id: "JP47", name: "沖縄県" },
];

// 契約企業数（連続量）を表す配色用の単色（青）ランプ：低→高
// 参照: dataviz スキルの sequential ramp（100〜700ステップ）から5段階を採用
const SEQUENTIAL_RAMP_LIGHT = [
    "#86b6ef", // 250
    "#5598e7", // 350
    "#2a78d6", // 450
    "#1c5cab", // 550
    "#0d366b", // 700
];
// ダークモードはアンカーを反転（低い値ほど暗い面に沈み込み、高い値ほど明るく浮き上がる）
const SEQUENTIAL_RAMP_DARK = [...SEQUENTIAL_RAMP_LIGHT].reverse();

// 契約実績が0件の都道府県（データなし）は連続量スケールと区別できる中立グレーにする
const NO_DATA_FILL = { light: "#e1e0d9", dark: "#2c2c2a" };

function useIsDarkMode() {
    const [isDark, setIsDark] = useState(
        () =>
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark"),
    );

    useEffect(() => {
        const target = document.documentElement;
        const observer = new MutationObserver(() => {
            setIsDark(target.classList.contains("dark"));
        });
        observer.observe(target, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

function bucketColor(count, maxCount, isDark) {
    const ramp = isDark ? SEQUENTIAL_RAMP_DARK : SEQUENTIAL_RAMP_LIGHT;
    if (!count || maxCount <= 0) {
        return isDark ? NO_DATA_FILL.dark : NO_DATA_FILL.light;
    }
    const bucketIndex = Math.min(
        ramp.length - 1,
        Math.ceil((count / maxCount) * ramp.length) - 1,
    );
    return ramp[Math.max(0, bucketIndex)];
}

export default function PrefectureContractsMap({ data }) {
    const isDark = useIsDarkMode();
    const counts = data?.counts || {};
    const totalCompanies = data?.totalCompanies || 0;

    const maxCount = useMemo(
        () => Math.max(0, ...Object.values(counts).map((v) => Number(v) || 0)),
        [counts],
    );

    const mapData = useMemo(
        () =>
            JAPAN_PREFECTURES.map((pref) => {
                const count = Number(counts[pref.name]) || 0;
                return {
                    id: pref.id,
                    fill: bucketColor(count, maxCount, isDark),
                    description:
                        count > 0 ? `契約企業数: ${count}社` : "契約実績なし",
                };
            }),
        [counts, maxCount, isDark],
    );

    const ranking = useMemo(
        () =>
            JAPAN_PREFECTURES.map((pref) => ({
                name: pref.name,
                count: Number(counts[pref.name]) || 0,
            }))
                .filter((row) => row.count > 0)
                .sort((a, b) => b.count - a.count),
        [counts],
    );

    const legendRamp = isDark ? SEQUENTIAL_RAMP_DARK : SEQUENTIAL_RAMP_LIGHT;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <span>契約企業の地域分布</span>
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                        契約実績のある企業: {totalCompanies}社
                    </span>
                </div>
            </CardHeader>
            <CardBody>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-3/5 flex-shrink-0">
                        <JapanMap
                            data={mapData}
                            lang="ja"
                            strokeColor={isDark ? "#475569" : "#cbd5e1"}
                            hoverColor="#f59e0b"
                            size="100%"
                        />
                        <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                少
                            </span>
                            <div className="flex h-3 flex-1 max-w-xs overflow-hidden rounded-full">
                                {legendRamp.map((color) => (
                                    <span
                                        key={color}
                                        className="flex-1"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                多
                            </span>
                            <span className="ml-4 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        backgroundColor: isDark
                                            ? NO_DATA_FILL.dark
                                            : NO_DATA_FILL.light,
                                    }}
                                />
                                契約実績なし
                            </span>
                        </div>
                    </div>

                    <div className="lg:w-2/5 lg:border-l lg:border-slate-200 lg:dark:border-slate-700 lg:pl-6">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            都道府県別ランキング
                        </h4>
                        {ranking.length > 0 ? (
                            <ul className="space-y-1.5 max-h-80 overflow-y-auto">
                                {ranking.map((row, index) => (
                                    <li
                                        key={row.name}
                                        className="flex items-center justify-between text-sm py-1"
                                    >
                                        <span className="text-slate-700 dark:text-slate-300">
                                            <span className="inline-block w-5 text-slate-400 dark:text-slate-500 tabular-nums">
                                                {index + 1}.
                                            </span>
                                            {row.name}
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-slate-100 tabular-nums">
                                            {row.count}社
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                契約実績のあるデータがありません
                            </p>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
