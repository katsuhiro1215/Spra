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
 */
export const getStatusBadge = (isActive) => {
    return isActive ? STATUS_BADGES.active : STATUS_BADGES.inactive;
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
