import { CommonUIConstants } from "@/Constants/CommonUIConstants";

/**
 * 共通アクションラベル生成
 * @param {string} action - 'create', 'edit', 'delete' など
 * @param {string} target - 'ページ', '記事' など
 * @returns {string}
 */
export function actionLabel(action, target = "") {
    const label = CommonUIConstants.actions[action] ?? "";
    return target ? `${label}${target}` : label;
}
