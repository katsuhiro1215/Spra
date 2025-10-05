import { forwardRef, useState } from 'react';

export default forwardRef(function FileInput(
    { 
        className = '',
        accept,
        multiple = false,
        onChange,
        showPreview = false,
        maxSize,
        ...props 
    },
    ref,
) {
    const [files, setFiles] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // ファイルサイズチェック
        if (maxSize) {
            const validFiles = selectedFiles.filter(file => file.size <= maxSize);
            if (validFiles.length !== selectedFiles.length) {
                alert(`ファイルサイズは${Math.round(maxSize / 1024 / 1024)}MB以下にしてください。`);
            }
            setFiles(validFiles);
            onChange && onChange({ target: { files: validFiles } });
        } else {
            setFiles(selectedFiles);
            onChange && onChange(e);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        
        if (maxSize) {
            const validFiles = droppedFiles.filter(file => file.size <= maxSize);
            setFiles(validFiles);
            // 仮想的なイベントオブジェクトを作成
            onChange && onChange({ target: { files: validFiles } });
        } else {
            setFiles(droppedFiles);
            onChange && onChange({ target: { files: droppedFiles } });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    return (
        <div className={`relative ${className}`}>
            <div
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${dragOver 
                        ? 'border-indigo-400 bg-indigo-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    {...props}
                    ref={ref}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-indigo-600">クリック</span>
                        してファイルを選択するか、ドラッグ&ドロップ
                    </p>
                    {accept && (
                        <p className="text-xs text-gray-500 mt-1">
                            対応形式: {accept}
                        </p>
                    )}
                    {maxSize && (
                        <p className="text-xs text-gray-500">
                            最大サイズ: {Math.round(maxSize / 1024 / 1024)}MB
                        </p>
                    )}
                </div>
            </div>

            {/* ファイルプレビュー */}
            {showPreview && files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                            <svg className="w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                            <span className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)}MB
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});