import Button from "./Button";

/**
 * CrudButton - CRUD操作用の簡略化ボタン
 *
 * @param {string} action - CRUD操作タイプ (create, store, show, edit, update, delete)
 * @param {string} type - HTML button type (button, submit, reset) デフォルト: button
 * @param {boolean} useTheme - カラーテーマを使用（デフォルト: false）
 * @param {string} size - ボタンサイズ (xs, sm, md, lg, xl)
 * @param {boolean} loading - ローディング状態
 * @param {boolean} disabled - 無効化フラグ
 * @param {string} href - リンク先URL
 * @param {React.ReactNode} children - ボタンの内容（指定しない場合はデフォルトラベル）
 * @param {string} className - 追加のCSSクラス
 */
export default function CrudButton({
    action = "store",
    type = "button",
    useTheme = false,
    size = "md",
    loading = false,
    disabled = false,
    href = null,
    children,
    className = "",
    ...props
}) {
    // タイプごとの設定
    const configs = {
        create: {
            variant: "success",
            icon: "M12 4.5v15m7.5-7.5h-15",
            label: "新規作成",
        },
        store: {
            variant: "primary",
            icon: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z",
            label: "保存",
        },
        show: {
            variant: "info",
            icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
            label: "詳細",
        },
        edit: {
            variant: "warning",
            icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
            label: "編集",
        },
        update: {
            variant: "primary",
            icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
            label: "更新",
        },
        delete: {
            variant: "danger",
            icon: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
            label: "削除",
        },
    };

    const config = configs[action] || configs.store;

    return (
        <Button
            variant={config.variant}
            useTheme={useTheme}
            icon={config.icon}
            size={size}
            type={type}
            loading={loading}
            disabled={disabled}
            href={href}
            className={className}
            {...props}
        >
            {children || config.label}
        </Button>
    );
}

// 個別エクスポート（後方互換性）
export const CreateButton = (props) => (
    <CrudButton action="create" {...props} />
);
export const StoreButton = (props) => <CrudButton action="store" {...props} />;
export const ShowButton = (props) => <CrudButton action="show" {...props} />;
export const EditButton = (props) => <CrudButton action="edit" {...props} />;
export const UpdateButton = (props) => (
    <CrudButton action="update" {...props} />
);
export const DeleteButton = (props) => (
    <CrudButton action="delete" {...props} />
);
