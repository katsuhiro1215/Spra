import React, { useState, useCallback } from "react";
import { useForm } from "@inertiajs/react";
import {
    XMarkIcon,
    CloudArrowUpIcon,
    PhotoIcon,
    DocumentIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

const UploadModal = ({ isOpen, onClose, folders = [] }) => {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        files: [],
        folder: "",
        description: "",
        tags: [],
    });

    const handleFileSelect = useCallback(
        (files) => {
            const fileArray = Array.from(files);
            setSelectedFiles((prev) => [...prev, ...fileArray]);
            setData("files", [...data.files, ...fileArray]);
        },
        [data.files, setData]
    );

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setDragOver(false);
            const files = e.dataTransfer.files;
            handleFileSelect(files);
        },
        [handleFileSelect]
    );

    const handleFileInput = useCallback(
        (e) => {
            const files = e.target.files;
            handleFileSelect(files);
        },
        [handleFileSelect]
    );

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setData(
            "files",
            data.files.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.files.length === 0) {
            return;
        }

        post(route("admin.media.upload"), {
            onSuccess: () => {
                reset();
                setSelectedFiles([]);
                onClose();
            },
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith("image/")) {
            return <PhotoIcon className="w-8 h-8 text-blue-500" />;
        }
        return <DocumentIcon className="w-8 h-8 text-gray-500" />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* オーバーレイ */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                />

                {/* モーダル */}
                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    {/* ヘッダー */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            ファイルアップロード
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ドラッグ&ドロップエリア */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                                dragOver
                                    ? "border-blue-400 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                                <label className="cursor-pointer">
                                    <span className="text-lg font-medium text-gray-900">
                                        ファイルをドラッグ&ドロップ
                                    </span>
                                    <span className="text-gray-500">
                                        {" "}
                                        または{" "}
                                    </span>
                                    <span className="text-blue-600 hover:text-blue-500">
                                        クリックして選択
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileInput}
                                        className="hidden"
                                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                                    />
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                画像、動画、ドキュメント (最大20MB)
                            </p>
                        </div>

                        {errors.files && (
                            <div className="text-red-600 text-sm">
                                {errors.files}
                            </div>
                        )}

                        {/* 選択されたファイル一覧 */}
                        {selectedFiles.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-900">
                                    選択されたファイル ({selectedFiles.length})
                                </h4>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {getFileIcon(file)}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(
                                                            file.size
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                className="p-1 text-red-400 hover:text-red-600"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* フォルダ選択 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    フォルダ
                                </label>
                                <select
                                    value={data.folder}
                                    onChange={(e) =>
                                        setData("folder", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">ルートフォルダ</option>
                                    {folders.map((folder) => (
                                        <option key={folder} value={folder}>
                                            {folder}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        placeholder="または新しいフォルダ名を入力"
                                        value={data.folder}
                                        onChange={(e) =>
                                            setData("folder", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                                {errors.folder && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.folder}
                                    </div>
                                )}
                            </div>

                            {/* タグ */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    タグ (カンマ区切り)
                                </label>
                                <input
                                    type="text"
                                    value={data.tags.join(", ")}
                                    onChange={(e) =>
                                        setData(
                                            "tags",
                                            e.target.value
                                                .split(",")
                                                .map((tag) => tag.trim())
                                                .filter((tag) => tag)
                                        )
                                    }
                                    placeholder="写真, 商品, バナー..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.tags && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.tags}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 説明 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                説明 (オプション)
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ファイルの説明を入力..."
                            />
                            {errors.description && (
                                <div className="text-red-600 text-sm mt-1">
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        {/* アクションボタン */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={
                                    processing || selectedFiles.length === 0
                                }
                                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {processing
                                    ? "アップロード中..."
                                    : `${selectedFiles.length}件をアップロード`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
