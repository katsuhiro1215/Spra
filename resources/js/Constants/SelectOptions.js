/**
 * セレクト要素・フィルタ用のオプション定義
 * フォームやフィルタコンポーネントで使用される選択肢を管理
 */

/**
 * Admin役割のセレクトオプション
 */
export const ADMIN_ROLE_OPTIONS = [
    { value: "owner", label: "オーナー" },
    { value: "super_admin", label: "スーパー管理者" },
    { value: "admin", label: "管理者" },
    { value: "editor", label: "編集者" },
];

/**
 * Admin/Userステータスのセレクトオプション（Company等、同じ active/inactive/suspended の3値を取るモデルでも共用）
 */
export const ADMIN_STATUS_OPTIONS = [
    { value: "active", label: "アクティブ" },
    { value: "inactive", label: "非アクティブ" },
    { value: "suspended", label: "停止中" },
];

/**
 * 会社種別のセレクトオプション
 */
export const COMPANY_TYPE_OPTIONS = [
    { value: "individual", label: "個人" },
    { value: "corporate", label: "法人" },
];

/**
 * 業界のセレクトオプション
 */
export const INDUSTRY_OPTIONS = [
    { value: "製造業", label: "製造業" },
    { value: "IT・ソフトウェア", label: "IT・ソフトウェア" },
    { value: "建設・不動産", label: "建設・不動産" },
    { value: "小売・卸売", label: "小売・卸売" },
    { value: "金融・保険", label: "金融・保険" },
    { value: "運輸・物流", label: "運輸・物流" },
    { value: "医療・介護", label: "医療・介護" },
    { value: "教育", label: "教育" },
    { value: "飲食・宿泊", label: "飲食・宿泊" },
    { value: "コンサルティング", label: "コンサルティング" },
    { value: "マーケティング・広告", label: "マーケティング・広告" },
    { value: "エネルギー", label: "エネルギー" },
    { value: "農業・林業・漁業", label: "農業・林業・漁業" },
    { value: "公務", label: "公務" },
    { value: "その他", label: "その他" },
];

/**
 * 性別のセレクトオプション
 */
export const GENDER_OPTIONS = [
    { value: "male", label: "男性" },
    { value: "female", label: "女性" },
    { value: "other", label: "その他" },
    { value: "prefer_not_to_say", label: "回答しない" },
];

/**
 * 住所種別のセレクトオプション
 */
export const ADDRESS_TYPE_OPTIONS = [
    { value: "home", label: "自宅" },
    { value: "office", label: "オフィス" },
    { value: "branch", label: "支店" },
    { value: "billing", label: "請求先" },
    { value: "shipping", label: "配送先" },
    { value: "other", label: "その他" },
];

/**
 * 都道府県名のセレクトオプション
 */
export const PREFECTURE_OPTIONS = [
    { value: "北海道", label: "北海道" },
    { value: "青森県", label: "青森県" },
    { value: "岩手県", label: "岩手県" },
    { value: "宮城県", label: "宮城県" },
    { value: "秋田県", label: "秋田県" },
    { value: "山形県", label: "山形県" },
    { value: "福島県", label: "福島県" },
    { value: "茨城県", label: "茨城県" },
    { value: "栃木県", label: "栃木県" },
    { value: "群馬県", label: "群馬県" },
    { value: "埼玉県", label: "埼玉県" },
    { value: "千葉県", label: "千葉県" },
    { value: "東京都", label: "東京都" },
    { value: "神奈川県", label: "神奈川県" },
    { value: "新潟県", label: "新潟県" },
    { value: "富山県", label: "富山県" },
    { value: "石川県", label: "石川県" },
    { value: "福井県", label: "福井県" },
    { value: "山梨県", label: "山梨県" },
    { value: "長野県", label: "長野県" },
    { value: "岐阜県", label: "岐阜県" },
    { value: "静岡県", label: "静岡県" },
    { value: "愛知県", label: "愛知県" },
    { value: "三重県", label: "三重県" },
    { value: "滋賀県", label: "滋賀県" },
    { value: "京都府", label: "京都府" },
    { value: "大阪府", label: "大阪府" },
    { value: "兵庫県", label: "兵庫県" },
    { value: "奈良県", label: "奈良県" },
    { value: "和歌山県", label: "和歌山県" },
    { value: "鳥取県", label: "鳥取県" },
    { value: "島根県", label: "島根県" },
    { value: "岡山県", label: "岡山県" },
    { value: "広島県", label: "広島県" },
    { value: "山口県", label: "山口県" },
    { value: "徳島県", label: "徳島県" },
    { value: "香川県", label: "香川県" },
    { value: "愛媛県", label: "愛媛県" },
    { value: "高知県", label: "高知県" },
    { value: "福岡県", label: "福岡県" },
    { value: "佐賀県", label: "佐賀県" },
    { value: "長崎県", label: "長崎県" },
    { value: "熊本県", label: "熊本県" },
    { value: "大分県", label: "大分県" },
    { value: "宮崎県", label: "宮崎県" },
    { value: "鹿児島県", label: "鹿児島県" },
    { value: "沖縄県", label: "沖縄県" },
];

/**
 * メディアタイプのセレクトオプション
 */
export const MEDIA_TYPE_OPTIONS = [
    { value: "image", label: "画像" },
    { value: "video", label: "動画" },
    { value: "3d_model", label: "3Dモデル" },
];

/**
 * メディア使用用途のセレクトオプション
 */
export const MEDIA_USAGE_TYPE_OPTIONS = [
    { value: "profile", label: "プロフィール画像" },
    { value: "admin_profile", label: "Adminプロフィール" },
    { value: "user_profile", label: "Userプロフィール" },
    { value: "unused", label: "未使用" },
];

/**
 * サービスカテゴリステータスのセレクトオプション
 */
export const SERVICE_CATEGORY_STATUS_OPTIONS = [
    { value: "active", label: "アクティブ" },
    { value: "inactive", label: "非アクティブ" },
    { value: "suspended", label: "停止中" },
];

/**
 * サービスステータスのセレクトオプション
 */
export const SERVICE_STATUS_OPTIONS = [
    { value: "active", label: "アクティブ" },
    { value: "inactive", label: "非アクティブ" },
    { value: "suspended", label: "停止中" },
];

/**
 * 注目サービスのセレクトオプション
 */
export const IS_FEATURED_OPTIONS = [
    { value: "1", label: "注目" },
    { value: "0", label: "通常" },
];

/**
 * お問い合わせ流入元のセレクトオプション
 */
export const CONTACT_SOURCE_OPTIONS = [
    { value: "web", label: "Webフォーム" },
    { value: "phone", label: "電話" },
    { value: "email", label: "メール" },
    { value: "sns", label: "SNS" },
    { value: "referral", label: "紹介" },
    { value: "other", label: "その他" },
];

/**
 * お問い合わせステータスのセレクトオプション
 */
export const CONTACT_STATUS_OPTIONS = [
    { value: "new", label: "新規" },
    { value: "in_progress", label: "対応中" },
    { value: "replied", label: "返信済み" },
    { value: "closed", label: "クローズ" },
];

/**
 * お問い合わせカテゴリのセレクトオプション
 */
export const CONTACT_CATEGORY_OPTIONS = [
    { value: "estimate", label: "見積もり" },
    { value: "partnership", label: "業務提携" },
    { value: "support", label: "サポート" },
    { value: "other", label: "その他" },
];

/**
 * 見積もりステータスのセレクトオプション
 */
export const QUOTE_STATUS_OPTIONS = [
    { value: "draft", label: "下書き" },
    { value: "negotiating", label: "交渉中" },
    { value: "approved", label: "承認済み" },
    { value: "rejected", label: "却下" },
    { value: "contracted", label: "契約済み" },
    { value: "cancelled", label: "キャンセル" },
];

/**
 * 見積もり品目の課金形態のセレクトオプション
 */
export const QUOTE_BILLING_TYPE_OPTIONS = [
    { value: "one_time", label: "一括" },
    { value: "monthly", label: "月額" },
    { value: "yearly", label: "年額" },
    { value: "per_unit", label: "単位あたり" },
    { value: "hourly", label: "時間単位" },
    { value: "other", label: "その他" },
];

/**
 * 契約品目の課金形態のセレクトオプション
 */
export const CONTRACT_BILLING_TYPE_OPTIONS = [
    { value: "one_time", label: "一括" },
    { value: "monthly", label: "月額" },
    { value: "yearly", label: "年額" },
    { value: "per_unit", label: "単位あたり" },
    { value: "hourly", label: "時間単位" },
    { value: "other", label: "その他" },
];

/**
 * 見積もり割引タイプのセレクトオプション
 */
export const QUOTE_DISCOUNT_TYPE_OPTIONS = [
    { value: "fixed", label: "固定額" },
    { value: "percentage", label: "割合 (%)" },
];

/**
 * 契約ステータスのセレクトオプション
 */
export const CONTRACT_STATUS_OPTIONS = [
    { value: "draft", label: "下書き" },
    { value: "pending_signature", label: "署名待ち" },
    { value: "active", label: "契約中" },
    { value: "suspended", label: "一時停止" },
    { value: "completed", label: "完了" },
    { value: "cancelled", label: "キャンセル" },
];

/**
 * 契約タイプのセレクトオプション
 */
export const CONTRACT_TYPE_OPTIONS = [
    { value: "one_time", label: "一括払い" },
    { value: "monthly", label: "月額" },
    { value: "annual", label: "年額" },
];

/**
 * 請求書ステータスのセレクトオプション
 */
export const INVOICE_STATUS_OPTIONS = [
    { value: "draft", label: "下書き" },
    { value: "sent", label: "送付済み" },
    { value: "viewed", label: "確認済み" },
    { value: "paid", label: "支払済み" },
    { value: "overdue", label: "期限超過" },
    { value: "cancelled", label: "キャンセル" },
];

export const INVOICE_TYPE_OPTIONS = [
    { value: "deposit", label: "着手金" },
    { value: "interim", label: "中間金" },
    { value: "final", label: "完了金" },
    { value: "full", label: "一括" },
    { value: "monthly", label: "月額" },
    { value: "other", label: "その他" },
];

/**
 * 支払い方法のセレクトオプション
 */
export const PAYMENT_METHOD_OPTIONS = [
    { value: "bank_transfer", label: "銀行振込" },
    { value: "credit_card", label: "クレジットカード" },
    { value: "cash", label: "現金" },
    { value: "other", label: "その他" },
];

/**
 * 支払いステータスのセレクトオプション
 */
export const PAYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "保留中" },
    { value: "completed", label: "完了" },
    { value: "failed", label: "失敗" },
    { value: "refunded", label: "返金済み" },
];

/**
 * 支払いタイプ（着手金/中間金/最終支払い）のセレクトオプション
 */
export const PAYMENT_TYPE_OPTIONS = [
    { value: "deposit", label: "着手金" },
    { value: "interim", label: "中間金" },
    { value: "final", label: "最終支払い" },
    { value: "full", label: "一括払い" },
];
