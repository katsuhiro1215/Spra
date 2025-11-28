import { forwardRef } from 'react';

const BasicButton = forwardRef(({
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    className = '',
    ...props
}, ref) => {
    const { processing, ...rest } = props;

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
        pink: 'bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-500',
        purple: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
        teal: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
        orange: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
        outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
        outlineBlue: 'border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:ring-blue-500',
        outlineGreen: 'border border-green-600 text-green-600 bg-white hover:bg-green-50 focus:ring-green-500',
        outlineRed: 'border border-red-600 text-red-600 bg-white hover:bg-red-50 focus:ring-red-500',
        outlineYellow: 'border border-yellow-600 text-yellow-600 bg-white hover:bg-yellow-50 focus:ring-yellow-500',
        outlinePink: 'border border-pink-600 text-pink-600 bg-white hover:bg-pink-50 focus:ring-pink-500',
        outlinePurple: 'border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 focus:ring-purple-500',
        outlineTeal: 'border border-teal-600 text-teal-600 bg-white hover:bg-teal-50 focus:ring-teal-500',
        outlineOrange: 'border border-orange-600 text-orange-600 bg-white hover:bg-orange-50 focus:ring-orange-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    const iconSizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    const renderIcon = () => {
        if (!icon) return null;
        
        if (typeof icon === 'string') {
            // SVG path string の場合
            return (
                <svg 
                    className={`${iconSizes[size]} ${children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            );
        }
        
        // React コンポーネントの場合
        return (
            <span className={`${iconSizes[size]} ${children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}`}>
                {icon}
            </span>
        );
    };

    const renderLoadingSpinner = () => (
        <svg 
            className={`animate-spin ${iconSizes[size]} ${children ? 'mr-2' : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={classes}
            {...rest}
        >
            {loading && renderLoadingSpinner()}
            {!loading && iconPosition === 'left' && renderIcon()}
            {children}
            {!loading && iconPosition === 'right' && renderIcon()}
        </button>
    );
});

BasicButton.displayName = 'BasicButton';

export default BasicButton;