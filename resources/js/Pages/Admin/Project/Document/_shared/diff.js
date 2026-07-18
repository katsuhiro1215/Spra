import { diffLines } from "diff";
import { SECTION_DETAIL_RELATIONS, SECTION_DETAIL_SCHEMAS } from "./constants";

// 明細行の同一性判定キー（クローン時にidが変わるため、内容ベースのキーで対応行を突き合わせる）
const ROW_KEY_FNS = {
    db_table: (row) => row.name,
    api_group: (row) => `${row.http_method} ${row.path}`,
    feature_list: (row) => row.name,
    screen_list: (row) => row.screen_name,
    permission_list: (row) => `${row.role_name}::${row.permission}`,
};

function diffRows(sectionType, fromRows = [], toRows = []) {
    const keyFn = ROW_KEY_FNS[sectionType];
    const fields = Object.keys(SECTION_DETAIL_SCHEMAS[sectionType] || {});
    const fromMap = new Map(fromRows.map((r) => [keyFn(r), r]));
    const toMap = new Map(toRows.map((r) => [keyFn(r), r]));

    const keys = Array.from(new Set([...fromMap.keys(), ...toMap.keys()]));

    return keys.map((key) => {
        const from = fromMap.get(key);
        const to = toMap.get(key);

        if (from && !to) return { key, status: "removed", from, to: null, changedFields: [] };
        if (!from && to) return { key, status: "added", from: null, to, changedFields: [] };

        const changedFields = fields.filter((f) => String(from[f] ?? "") !== String(to[f] ?? ""));
        return {
            key,
            status: changedFields.length > 0 ? "changed" : "unchanged",
            from,
            to,
            changedFields,
        };
    });
}

const sectionKey = (section) => `${section.section_type}::${section.title}`;

/**
 * 2つのProjectDocumentVersion（sections + 各明細をロード済み）を比較し、
 * セクション単位・行単位の差分を返す。
 */
export function diffDocumentVersions(fromVersion, toVersion) {
    const fromSections = fromVersion?.sections || [];
    const toSections = toVersion?.sections || [];

    const fromMap = new Map(fromSections.map((s) => [sectionKey(s), s]));
    const toMap = new Map(toSections.map((s) => [sectionKey(s), s]));

    const orderedKeys = [];
    const seen = new Set();
    [...fromSections, ...toSections].forEach((s) => {
        const k = sectionKey(s);
        if (!seen.has(k)) {
            seen.add(k);
            orderedKeys.push(k);
        }
    });

    return orderedKeys.map((key) => {
        const from = fromMap.get(key) || null;
        const to = toMap.get(key) || null;

        if (from && !to) {
            const relation = SECTION_DETAIL_RELATIONS[from.section_type];
            const rows = relation ? diffRows(from.section_type, from[relation] || [], []) : [];
            return { key, title: from.title, sectionType: from.section_type, status: "removed", from, to, rows, textDiff: null };
        }
        if (!from && to) {
            const relation = SECTION_DETAIL_RELATIONS[to.section_type];
            const rows = relation ? diffRows(to.section_type, [], to[relation] || []) : [];
            return { key, title: to.title, sectionType: to.section_type, status: "added", from, to, rows, textDiff: null };
        }

        if (from.section_type === "text") {
            const bodyChanged = (from.body || "") !== (to.body || "");
            return {
                key,
                title: to.title,
                sectionType: to.section_type,
                status: bodyChanged ? "changed" : "unchanged",
                from,
                to,
                rows: [],
                textDiff: bodyChanged ? diffLines(from.body || "", to.body || "") : null,
            };
        }

        const relation = SECTION_DETAIL_RELATIONS[from.section_type];
        const fromRows = relation ? from[relation] || [] : [];
        const toRows = relation ? to[relation] || [] : [];
        const rows = diffRows(from.section_type, fromRows, toRows);
        const hasChange = rows.some((r) => r.status !== "unchanged");

        return {
            key,
            title: to.title,
            sectionType: to.section_type,
            status: hasChange ? "changed" : "unchanged",
            from,
            to,
            rows,
            textDiff: null,
        };
    });
}
