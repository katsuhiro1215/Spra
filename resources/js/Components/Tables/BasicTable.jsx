// Temporary wrapper component for table element
export default function BasicTable({ children, ...props }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" {...props}>
                {children}
            </table>
        </div>
    );
}
