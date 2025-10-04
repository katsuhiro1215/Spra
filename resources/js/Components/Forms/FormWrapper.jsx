export default function FormWrapper({ 
    children, 
    onSubmit,
    className = '',
    title,
    description,
    ...props 
}) {
    return (
        <div className={`bg-white shadow rounded-lg ${className}`}>
            {(title || description) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {title && (
                        <h3 className="text-lg font-medium text-gray-900">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="mt-1 text-sm text-gray-600">
                            {description}
                        </p>
                    )}
                </div>
            )}
            
            <form onSubmit={onSubmit} className="px-6 py-4 space-y-6" {...props}>
                {children}
            </form>
        </div>
    );
}

// フォームフィールドラッパー
export function FormField({ 
    label, 
    error, 
    required = false, 
    children, 
    className = '',
    description 
}) {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}
            {children}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

// フォームアクション（ボタン群）
export function FormActions({ 
    children, 
    className = '',
    align = 'right'
}) {
    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between'
    };

    return (
        <div className={`flex ${alignClasses[align]} space-x-3 pt-6 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    );
}