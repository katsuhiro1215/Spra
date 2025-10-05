import { forwardRef } from 'react';

export default forwardRef(function RadioButton({ 
    className = '', 
    ...props 
}, ref) {
    return (
        <input
            {...props}
            ref={ref}
            type="radio"
            className={
                'h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 ' +
                className
            }
        />
    );
});

// ラジオボタングループコンポーネント
export function RadioGroup({ 
    name, 
    options = [], 
    value, 
    onChange, 
    direction = 'vertical',
    className = '',
    ...props 
}) {
    const containerClasses = direction === 'horizontal' 
        ? 'flex flex-wrap gap-4' 
        : 'space-y-2';

    return (
        <div className={`${containerClasses} ${className}`} {...props}>
            {options.map((option) => (
                <label key={option.value} className="flex items-center">
                    <RadioButton
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange && onChange(e.target.value)}
                        className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    );
}