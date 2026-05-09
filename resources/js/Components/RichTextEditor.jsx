// TODO: Implement RichTextEditor component
export default function RichTextEditor({ value, onChange, ...props }) {
    return (
        <textarea
            value={value || ""}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={10}
            {...props}
        />
    );
}
