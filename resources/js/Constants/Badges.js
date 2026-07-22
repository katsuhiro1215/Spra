/**
 * バッジ表示用の定義
 * UIコンポーネントでバッジを表示する際の色やテキストを管理
 */

/**
 * データ型のバッジ情報
 */
export const DATA_TYPE_BADGES = {
    integer: { text: "整数", variant: "blue" },
    decimal: { text: "小数", variant: "green" },
    boolean: { text: "真偽値", variant: "purple" },
};

/**
 * ステータスのバッジ情報
 */
export const STATUS_BADGES = {
    active: { text: "アクティブ", variant: "success" },
    inactive: { text: "非アクティブ", variant: "secondary" },
    suspended: { text: "停止中", variant: "danger" },
    pending: { text: "承認待ち", variant: "warning" },
};

/**
 * 役割のバッジ情報
 */
export const ROLE_BADGES = {
    owner: { text: "オーナー", variant: "purple" },
    super_admin: { text: "スーパー管理者", variant: "danger" },
    admin: { text: "管理者", variant: "info" },
    editor: { text: "編集者", variant: "success" },
    ceo: { text: "CEO", variant: "primary" },
    system: { text: "システム管理者", variant: "success" },
    general_owner: { text: "一般オーナー", variant: "secondary" },
    superAdmin: { text: "最高管理者", variant: "danger" },
    subAdmin: { text: "副管理者", variant: "warning" },
    staff: { text: "スタッフ", variant: "info" },
    employee: { text: "従業員", variant: "info" },
    member: { text: "メンバー", variant: "secondary" },
    intern: { text: "インターン", variant: "pink" },
};

/**
 * 性別のバッジ情報
 */
export const GENDER_BADGES = {
    male: { text: "男性", variant: "blue" },
    female: { text: "女性", variant: "pink" },
    other: { text: "その他", variant: "gray" },
};

/**
 * データ型のバッジ情報を取得
 */
export const getDataTypeBadge = (dataType) => {
    return DATA_TYPE_BADGES[dataType] || { text: dataType, variant: "default" };
};

/**
 * ステータスのバッジ情報を取得
 *
 * "active"/"inactive"/"suspended" のようなステータス文字列を受け取った場合はそのまま対応するバッジを返す。
 * それ以外（is_published などの真偽値）は従来通り true/false で active/inactive を判定する。
 */
export const getStatusBadge = (status) => {
    if (typeof status === "string" && STATUS_BADGES[status]) {
        return STATUS_BADGES[status];
    }
    return status ? STATUS_BADGES.active : STATUS_BADGES.inactive;
};

/**
 * 役割のバッジ情報を取得
 */
export const getRoleBadge = (role) => {
    return ROLE_BADGES[role] || { text: role, variant: "default" };
};

/**
 * 性別のバッジ情報を取得
 */
export const getGenderBadge = (gender) => {
    return GENDER_BADGES[gender] || { text: gender, variant: "default" };
};

/**
 * お問い合わせステータスのバッジ情報を取得
 */
export const getContactStatusBadge = (status) => {
    const statusMap = {
        new: { text: "新規", variant: "info" },
        in_progress: { text: "対応中", variant: "warning" },
        replied: { text: "返信済み", variant: "success" },
        resolved: { text: "解決済み", variant: "success" },
        closed: { text: "クローズ", variant: "secondary" },
    };
    return statusMap[status] || { text: status, variant: "default" };
}
