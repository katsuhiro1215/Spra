// db_table型セクション（カラム定義）からMermaidのerDiagram記法を生成する。
// セクションのtitleをテーブル名として扱う想定（例: Users, Companies, Projects）。

const sanitizeIdentifier = (name) => {
    const cleaned = (name || "table").trim().replace(/[^a-zA-Z0-9_]/g, "_");
    return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned || "table";
};

/**
 * @param {Array} sections ProjectDocumentSection[]（columnsを含む）
 * @returns {string|null} Mermaid erDiagram記法。db_table型セクションが無ければnull
 */
export function buildErDiagram(sections) {
    const tableSections = (sections || []).filter((s) => s.section_type === "db_table");
    if (tableSections.length === 0) return null;

    const idByTitle = {};
    tableSections.forEach((section) => {
        idByTitle[section.title] = sanitizeIdentifier(section.title);
    });

    const entityLines = [];
    const relationLines = [];

    tableSections.forEach((section) => {
        const entityId = idByTitle[section.title];
        entityLines.push(`    ${entityId} {`);

        const columns = [...(section.columns || [])].sort((a, b) => a.sort_order - b.sort_order);
        columns.forEach((column) => {
            const type = sanitizeIdentifier(column.data_type || "string");
            const name = sanitizeIdentifier(column.name || "column");
            const key = column.is_primary_key
                ? "PK"
                : column.references_table
                  ? "FK"
                  : column.is_unique
                    ? "UK"
                    : "";
            entityLines.push(`        ${type} ${name}${key ? ` ${key}` : ""}`);

            if (column.references_table) {
                const targetId = idByTitle[column.references_table] || sanitizeIdentifier(column.references_table);
                relationLines.push(`    ${targetId} ||--o{ ${entityId} : "${column.name}"`);
            }
        });

        entityLines.push("    }");
    });

    return ["erDiagram", ...entityLines, ...relationLines].join("\n");
}
