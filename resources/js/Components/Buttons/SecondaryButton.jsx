import BaseButton from "./BaseButton";

/**
 * SecondaryButton - セカンダリボタン（後方互換性のため残存）
 * 新規実装では Button コンポーネントの使用を推奨
 */
export default function SecondaryButton({
    className = "",
    icon = null,
    iconPosition = "left",
    ...props
}) {
    return (
        <BaseButton
            variant="secondary"
            icon={icon}
            iconPosition={iconPosition}
            className={className}
            {...props}
        />
    );
}
