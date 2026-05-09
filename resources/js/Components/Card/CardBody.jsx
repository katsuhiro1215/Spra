import React from "react";

/**
 * CardBody - カードのボディコンポーネント
 */
const CardBody = ({ children, className = "", ...props }) => {
    return (
        <div className={`px-6 py-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export default CardBody;
