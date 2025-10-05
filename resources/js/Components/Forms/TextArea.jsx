import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextArea(
    { 
        className = '', 
        isFocused = false, 
        rows = 4,
        resize = 'vertical',
        ...props 
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const resizeClasses = {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize'
    };

    return (
        <textarea
            {...props}
            rows={rows}
            className={
                `rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${resizeClasses[resize]} ` +
                className
            }
            ref={localRef}
        />
    );
});