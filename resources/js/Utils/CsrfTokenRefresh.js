/**
 * CSRF トークン更新ユーティリティ
 * 定期的にバックエンドからトークンをリフレッシュします
 */

/**
 * CSRF トークンをメタタグから取得
 */
export function getCsrfToken() {
    return (
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || ""
    );
}

/**
 * メタタグ内の CSRF トークンを更新
 */
export function updateCsrfTokenInMeta(newToken) {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        metaTag.setAttribute("content", newToken);
        console.log("[CSRF] Token updated:", newToken.substring(0, 10) + "...");
        return true;
    }
    return false;
}

/**
 * バックエンドから新しい CSRF トークンを取得
 */
async function fetchNewCsrfToken() {
    try {
        const response = await fetch("/api/csrf-token/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        if (!response.ok) {
            console.error(
                "[CSRF] Failed to refresh token:",
                response.status,
                response.statusText,
            );
            return null;
        }

        const data = await response.json();
        console.log(
            "[CSRF] New token received at",
            new Date(data.timestamp * 1000).toLocaleTimeString(),
        );
        return data.token;
    } catch (error) {
        console.error("[CSRF] Error fetching new token:", error);
        return null;
    }
}

/**
 * CSRF トークンを自動更新開始
 *
 * @param {number} intervalMinutes - 更新間隔（分）、デフォルト 10分
 */
export function startCsrfTokenAutoRefresh(intervalMinutes = 10) {
    const intervalMs = intervalMinutes * 60 * 1000;

    console.log(
        `[CSRF] Auto-refresh started: every ${intervalMinutes} minutes`,
    );

    // 最初の更新を1分後に実行
    setTimeout(async () => {
        const newToken = await fetchNewCsrfToken();
        if (newToken) {
            updateCsrfTokenInMeta(newToken);
        }
    }, 60000); // 1分後

    // その後、定期的に更新
    const intervalId = setInterval(async () => {
        const newToken = await fetchNewCsrfToken();
        if (newToken) {
            updateCsrfTokenInMeta(newToken);
        }
    }, intervalMs);

    return intervalId; // クリーンアップ用に ID を返す
}

/**
 * CSRF トークン自動更新を停止
 *
 * @param {number} intervalId - startCsrfTokenAutoRefresh() から返された ID
 */
export function stopCsrfTokenAutoRefresh(intervalId) {
    clearInterval(intervalId);
    console.log("[CSRF] Auto-refresh stopped");
}
