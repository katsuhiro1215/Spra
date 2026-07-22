import BaseButton from "./BaseButton";

/**
 * PrimaryButton - プライマリボタン（後方互換性のため残存）
 * 新規実装では Button コンポーネントの使用を推奨
 */
export default function PrimaryButton({
    className = "",
    icon = null,
    iconPosition = "left",
    ...props
}) {
    return (
        <BaseButton
            variant="primary"
            icon={icon}
            iconPosition={iconPosition}
            className={className}
            {...props}
        />
    );
}
