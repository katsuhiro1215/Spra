import React from "react";

/**
 * CardFooter - カードのフッターコンポーネント
 */
const CardFooter = ({ children, className = "", ...props }) => {
    return (
        <div className={`px-6 py-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default CardFooter;
