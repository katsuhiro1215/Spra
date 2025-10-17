// ==========================================
// Components バレルエクスポート (整理版)
// 機能別にディレクトリ分けしてより管理しやすく
// ==========================================

// === Buttons ===
export * from "./Buttons";

// === Forms ===
export * from "./Forms";

// === Alerts ===
export * from "./Alerts";

// === Layout ===
export * from "./Layout";

// === Navigation ===
export * from "./Navigation";

// === Notifications ===
export * from "./Notifications";

// === Brand & Logo ===
export { default as ApplicationLogo } from "./ApplicationLogo";

// === Brand ===
export { default as ApplicationLogo } from "./ApplicationLogo";

// === Forms (Laravel Breeze互換) ===
export * from "./Forms";

// ==========================================
// 将来のアトミックデザイン移行時の互換性エイリアス
// ==========================================

// Button Group
export const Button = {
    Basic: BasicButton,
    Primary: PrimaryButton,
    Secondary: SecondaryButton,
    Danger: DangerButton,
};

// Input Group
export const Input = {
    Text: TextInput,
    Validated: ValidatedInput,
    TextArea: ValidatedTextArea,
    Label: InputLabel,
    Error: InputError,
};

// 使用例:
// import { Button, Input } from '@/Components';
// <Button.Primary>送信</Button.Primary>
// <Input.Validated name="email" />
