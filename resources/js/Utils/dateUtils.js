/**
 * ローカルタイムゾーンの日付を "YYYY-MM-DD" 形式に変換する。
 * Date#toISOString() はUTCに変換するため、UTCより進んだタイムゾーン（JST等）では
 * 日付が1日ずれることがある。カレンダー表示のキーには必ずこちらを使用する。
 */
export function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function todayDateKey() {
    return formatDateKey(new Date());
}
