// ==========================================
// Components バレルエクスポート
// 現在の構造を最適化しつつ、将来の移行に備える
// ==========================================

// === Atomic Level (基本要素) ===
// Buttons
export { default as BasicButton } from "./BasicButton";
export { default as PrimaryButton } from "./PrimaryButton";
export { default as SecondaryButton } from "./SecondaryButton";
export { default as DangerButton } from "./DangerButton";

// CRUD Buttons
export {
    CreateButton,
    StoreButton,
    ShowButton,
    EditButton,
    UpdateButton,
    DeleteButton,
} from "./CrudButtons";

// Basic Inputs
export { default as TextInput } from "./TextInput";
export { default as InputLabel } from "./InputLabel";
export { default as InputError } from "./InputError";
export { default as Checkbox } from "./Checkbox";

// === Molecular Level (組み合わせ) ===
// Validated Components
export { default as ValidatedInput } from "./ValidatedInput";
export { default as ValidatedTextArea } from "./ValidatedTextArea";

// UI Components
export { default as SearchFilter } from "./SearchFilter";
export { default as Pagination } from "./Pagination";

// === Organism Level (複雑な組み合わせ) ===
export { default as PageHeader } from "./PageHeader";
export { default as Modal } from "./Modal";
export { default as Dropdown } from "./Dropdown";
export { default as RichTextEditor } from "./RichTextEditor";

// === Navigation ===
export { default as NavLink } from "./NavLink";
export { default as ResponsiveNavLink } from "./ResponsiveNavLink";

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
