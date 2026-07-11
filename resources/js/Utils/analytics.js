/**
 * アクセス解析ビーコンユーティリティ
 * 公開サイトのページ表示を匿名で /api/analytics/event に送信します
 */

const SESSION_STORAGE_KEY = "analytics_session_id";

/**
 * タブセッション単位の匿名セッションIDを取得（なければ発行）
 */
function getSessionId() {
    try {
        let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!sessionId) {
            sessionId =
                typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
        }
        return sessionId;
    } catch {
        return null;
    }
}

/**
 * URLのクエリ文字列からUTMパラメータを抽出
 */
function extractUtmParams(search) {
    const params = new URLSearchParams(search);
    return {
        utm_source: params.get("utm_source") || undefined,
        utm_medium: params.get("utm_medium") || undefined,
        utm_campaign: params.get("utm_campaign") || undefined,
        utm_term: params.get("utm_term") || undefined,
        utm_content: params.get("utm_content") || undefined,
    };
}

/**
 * ページビューイベントを送信する
 */
export function trackPageview() {
    try {
        const payload = {
            session_id: getSessionId(),
            event_type: "pageview",
            url: window.location.pathname,
            referrer_url: document.referrer || undefined,
            ...extractUtmParams(window.location.search),
        };

        const body = JSON.stringify(payload);
        const endpoint = "/api/analytics/event";

        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: "application/json" });
            navigator.sendBeacon(endpoint, blob);
            return;
        }

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
        }).catch(() => {
            // 収集できなくてもユーザー体験には影響させない
        });
    } catch {
        // アクセス解析の失敗はサイト表示を妨げない
    }
}
