import {
    DocumentTextIcon,
    CircleStackIcon,
    CodeBracketIcon,
    ClipboardDocumentListIcon,
    Square2StackIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";

// バックエンド ProjectDocument::DOCUMENT_TYPES と対応させること
export const DOCUMENT_TYPE_LABELS = {
    overview: "概要",
    requirements: "要件定義",
    basic_design: "基本設計",
    detail_design: "詳細設計",
    database_design: "DB設計",
    api_design: "API設計",
    screen_design: "画面設計",
    test: "テスト",
    release: "リリース",
    documents: "その他ドキュメント",
};

// バックエンド ProjectDocument::ALLOWED_SECTION_TYPES と対応させること
export const ALLOWED_SECTION_TYPES = {
    overview: ["text"],
    requirements: ["text", "feature_list"],
    basic_design: ["text", "feature_list", "screen_list", "permission_list"],
    detail_design: ["text"],
    database_design: ["text", "db_table"],
    api_design: ["text", "api_group"],
    screen_design: ["text", "screen_list"],
    test: ["text"],
    release: ["text"],
    documents: ["text"],
};

export const DOCUMENT_STATUS_LABELS = {
    draft: "下書き",
    in_progress: "作成中",
    reviewing: "レビュー中",
    confirmed: "確定済み",
};

export const VERSION_STATUS_LABELS = {
    draft: "編集中",
    released: "確定済み",
    superseded: "改訂版あり",
};

// バックエンド ProjectDocumentSection::SECTION_TYPES と対応させること
export const SECTION_TYPE_META = {
    text: {
        label: "本文",
        icon: DocumentTextIcon,
    },
    db_table: {
        label: "DBテーブル定義",
        icon: CircleStackIcon,
    },
    api_group: {
        label: "APIエンドポイント一覧",
        icon: CodeBracketIcon,
    },
    feature_list: {
        label: "機能一覧",
        icon: ClipboardDocumentListIcon,
    },
    screen_list: {
        label: "画面一覧",
        icon: Square2StackIcon,
    },
    permission_list: {
        label: "権限一覧",
        icon: LockClosedIcon,
    },
};

// section_type -> Eloquentリレーション名（バックエンド ProjectDocumentSection::DETAIL_RELATIONS と対応）
export const SECTION_DETAIL_RELATIONS = {
    db_table: "columns",
    api_group: "endpoints",
    feature_list: "features",
    screen_list: "screens",
    permission_list: "permissions",
};

// ArrayFieldEditor の itemsSchema。db_table/api_group/feature_list/screen_list/permission_list のみ使用
export const SECTION_DETAIL_SCHEMAS = {
    db_table: {
        name: { type: "text", label: "カラム名", required: true },
        data_type: { type: "text", label: "型（例: varchar, ulid, integer）", required: true },
        length: { type: "text", label: "長さ" },
        nullable: { type: "boolean", label: "NULL許可" },
        default_value: { type: "text", label: "デフォルト値" },
        is_primary_key: { type: "boolean", label: "主キー" },
        is_unique: { type: "boolean", label: "ユニーク" },
        references_table: { type: "text", label: "参照先テーブル" },
        references_column: { type: "text", label: "参照先カラム" },
        comment: { type: "text", label: "コメント" },
    },
    api_group: {
        http_method: {
            type: "select",
            label: "HTTPメソッド",
            required: true,
            default: "GET",
            options: ["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => ({ value: m, label: m })),
        },
        path: { type: "text", label: "パス（例: /api/users/{id}）", required: true },
        summary: { type: "text", label: "概要" },
        request_body: { type: "textarea", label: "リクエスト" },
        response_body: { type: "textarea", label: "レスポンス" },
        status_codes: { type: "text", label: "ステータスコード" },
        notes: { type: "textarea", label: "備考" },
    },
    feature_list: {
        name: { type: "text", label: "機能名", required: true },
        description: { type: "textarea", label: "説明" },
        related_screen: { type: "text", label: "関連画面" },
        priority: {
            type: "select",
            label: "優先度",
            default: "medium",
            options: [
                { value: "low", label: "低" },
                { value: "medium", label: "中" },
                { value: "high", label: "高" },
            ],
        },
        status: {
            type: "select",
            label: "状態",
            default: "planned",
            options: [
                { value: "planned", label: "未着手" },
                { value: "in_progress", label: "開発中" },
                { value: "done", label: "完了" },
            ],
        },
    },
    screen_list: {
        screen_name: { type: "text", label: "画面名", required: true },
        path: { type: "text", label: "パス" },
        description: { type: "textarea", label: "説明" },
        related_features: { type: "text", label: "関連機能" },
    },
    permission_list: {
        role_name: { type: "text", label: "ロール", required: true },
        permission: { type: "text", label: "権限", required: true },
        description: { type: "textarea", label: "説明" },
    },
};
