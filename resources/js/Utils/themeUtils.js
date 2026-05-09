/**
 * カラーテーマを適用するユーティリティ関数
 */

/**
 * プライマリカラーのスタイルを取得
 * @param {boolean} disabled - 無効化状態
 * @returns {Object} スタイルオブジェクト
 */
export const getPrimaryStyle = (disabled = false) => {
    if (disabled) {
        return { backgroundColor: "#9CA3AF" };
    }
    return { backgroundColor: "var(--color-primary)" };
};

/**
 * プライマリアウトラインのスタイルを取得
 * @param {boolean} disabled - 無効化状態
 * @returns {Object} スタイルオブジェクト
 */
export const getPrimaryOutlineStyle = (disabled = false) => {
    if (disabled) {
        return {
            borderColor: "#9CA3AF",
            color: "#9CA3AF",
        };
    }
    return {
        borderColor: "var(--color-primary)",
        color: "var(--color-primary)",
    };
};

/**
 * プライマリバックグラウンドカラーのスタイルを取得
 * @param {boolean} disabled - 無効化状態
 * @param {number} opacity - 透明度（0-1）
 * @returns {Object} スタイルオブジェクト
 */
export const getPrimaryBackgroundStyle = (disabled = false, opacity = 1) => {
    if (disabled) {
        return { backgroundColor: "#9CA3AF" };
    }
    if (opacity < 1) {
        return {
            backgroundColor: `rgba(var(--color-primary-rgb), ${opacity})`,
        };
    }
    return { backgroundColor: "var(--color-primary)" };
};

/**
 * マウスホバー時のハンドラ（プライマリカラー用）
 * @param {Event} e - イベントオブジェクト
 * @param {boolean} disabled - 無効化状態
 */
export const handlePrimaryHover = (e, disabled = false) => {
    if (!disabled) {
        e.currentTarget.style.backgroundColor = "var(--color-primary-hover)";
    }
};

/**
 * マウスリーブ時のハンドラ（プライマリカラー用）
 * @param {Event} e - イベントオブジェクト
 * @param {boolean} disabled - 無効化状態
 */
export const handlePrimaryLeave = (e, disabled = false) => {
    if (!disabled) {
        e.currentTarget.style.backgroundColor = "var(--color-primary)";
    }
};

/**
 * カラーバリアントごとのスタイルを取得
 * @param {string} variant - カラーバリアント
 * @param {boolean} disabled - 無効化状態
 * @returns {Object} スタイルオブジェクト
 */
export const getColorStyle = (variant = "primary", disabled = false) => {
    if (disabled) {
        return { backgroundColor: "#9CA3AF", borderColor: "#9CA3AF" };
    }

    switch (variant) {
        case "primary":
            return getPrimaryStyle(disabled);
        case "outlinePrimary":
            return getPrimaryOutlineStyle(disabled);
        default:
            return {};
    }
};
