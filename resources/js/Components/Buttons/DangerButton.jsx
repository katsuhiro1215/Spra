import BaseButton from "./BaseButton";

/**
 * DangerButton - 危険な操作用ボタン（後方互換性のため残存）
 * 新規実装では Button コンポーネントの使用を推奨
 */
export default function DangerButton({
    className = "",
    icon = null,
    iconPosition = "left",
    ...props
}) {
    return (
        <BaseButton
            variant="danger"
            icon={icon}
            iconPosition={iconPosition}
            className={className}
            {...props}
        />
    );
}
