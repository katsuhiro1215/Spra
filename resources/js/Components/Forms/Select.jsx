import { forwardRef } from 'react';

export default forwardRef(function Select(
    { 
        className = '', 
        children,
        placeholder,
        options = [],
        ...props 
    },
    ref,
) {
    return (
        <select
            {...props}
            ref={ref}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.length > 0 ? (
                options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
            ) : (
                children
            )}
        </select>
    );
});