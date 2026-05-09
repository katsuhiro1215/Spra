import { useState, useCallback } from "react";
import Modal from "@/Components/Layout/Modal";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    XMarkIcon,
    PhotoIcon,
    CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function MediaSelectModal({
    show = false,
    mediaList = [],
    multiple = false,
    uploadRoute,
    onClose,
    onSelect,
    onMediaUploaded,
}) {
    const [selectedMediaIds, setSelectedMediaIds] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const uploadFiles = useCallback(
        async (files) => {
            // アップロード中リストを初期化
            const fileDataList = files.map((file) => ({
                file,
                name: file.name,
                uploading: true,
                error: null,
            }));

            setUploadingFiles(fileDataList);

            // 各ファイルをアップロード
            for (const fileData of fileDataList) {
                try {
                    const formData = new FormData();
                    formData.append("image", fileData.file); // Vue版と同じく"image"を使用
                    formData.append("title", fileData.file.name.split(".")[0]);

                    const response = await axios.post(uploadRoute, formData, {
                        headers: {
                            Accept: "application/json",
                        },
                    });

                    fileData.uploading = false;

                    // アップロード成功したら自動的に選択状態にする
                    if (response.data.media) {
                        const mediaId = response.data.media.id;
                        setSelectedMediaIds((prev) => {
                            if (multiple) {
                                if (!prev.includes(mediaId)) {
                                    return [...prev, mediaId];
                                }
                                return prev;
                            } else {
                                return [mediaId];
                            }
                        });

                        // mediaListに新しいメディアを追加（即座に表示）
                        if (onMediaUploaded) {
                            onMediaUploaded(response.data.media);
                        }
                    }
                } catch (error) {
                    console.error("Upload error:", error);
                    fileData.uploading = false;
                    fileData.error =
                        error.response?.data?.message ||
                        "アップロードに失敗しました";
                }
            }

            // アップロード完了後、2秒後にアップロード中リストをクリア
            setTimeout(() => {
                setUploadingFiles([]);
            }, 2000);
        },
        [uploadRoute, onMediaUploaded, multiple],
    );

    const handleDrop = useCallback(
        async (e) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter((file) =>
                file.type.startsWith("image/"),
            );

            if (imageFiles.length === 0) {
                alert("画像ファイルのみアップロード可能です");
                return;
            }

            uploadFiles(imageFiles);
        },
        [uploadFiles],
    );

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        uploadFiles(files);
    };

    const selectMedia = (mediaId) => {
        console.log("selectMedia called, mediaId:", mediaId);

        if (multiple) {
            setSelectedMediaIds((prev) =>
                prev.includes(mediaId)
                    ? prev.filter((id) => id !== mediaId)
                    : [...prev, mediaId],
            );
        } else {
            setSelectedMediaIds([mediaId]);
        }
    };

    const isSelected = (mediaId) => {
        return selectedMediaIds.includes(mediaId);
    };

    const confirmSelection = () => {
        console.log(
            "confirmSelection called, selectedMediaIds:",
            selectedMediaIds,
        );

        if (selectedMediaIds.length === 0) {
            alert("メディアを選択してください");
            return;
        }

        if (multiple) {
            onSelect(selectedMediaIds);
        } else {
            onSelect(selectedMediaIds[0]);
        }

        handleClose();
    };

    const handleClose = () => {
        setSelectedMediaIds([]);
        setUploadingFiles([]);
        onClose();
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
        );
    };

    const hasMedia = mediaList.length > 0;

    return (
        <Modal show={show} maxWidth="2xl" onClose={handleClose}>
            <div className="p-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        画像を選択
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* ボディ */}
                <div className="space-y-6">
                    {/* 新規アップロードセクション */}
                    <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            新規アップロード
                        </h4>

                        {/* ドラッグ&ドロップエリア */}
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                                isDragging
                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                    : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                            }`}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                multiple={multiple}
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            <div className="space-y-2">
                                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />

                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                        クリックしてファイルを選択
                                    </span>
                                    またはドラッグ&ドロップ
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-500">
                                    PNG, JPG, GIF, WebP（最大10MB）
                                </p>
                            </div>

                            {/* アップロード中の表示 */}
                            {uploadingFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {uploadingFiles.map((fileData, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                                        >
                                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                                {fileData.name}
                                            </span>
                                            {fileData.uploading && (
                                                <span className="text-xs text-indigo-600 dark:text-indigo-400">
                                                    アップロード中...
                                                </span>
                                            )}
                                            {fileData.error && (
                                                <span className="text-xs text-red-600 dark:text-red-400">
                                                    {fileData.error}
                                                </span>
                                            )}
                                            {!fileData.uploading &&
                                                !fileData.error && (
                                                    <span className="text-xs text-green-600 dark:text-green-400">
                                                        完了
                                                    </span>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 区切り線 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                または
                            </span>
                        </div>
                    </div>

                    {/* 既存の画像から選択 */}
                    <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            既存の画像から選択 ({mediaList.length}件)
                        </h4>

                        {/* メディア一覧グリッド */}
                        {hasMedia ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 max-h-[400px] overflow-y-auto p-1">
                                {mediaList.map((media) => (
                                    <div
                                        key={media.id}
                                        onClick={() => selectMedia(media.id)}
                                        className={`group relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                                            isSelected(media.id)
                                                ? "border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900"
                                                : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500"
                                        }`}
                                    >
                                        <div className="aspect-square bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={media.url}
                                                alt={
                                                    media.alt_text ||
                                                    media.title
                                                }
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    console.error(
                                                        "Image load error for:",
                                                        media.url,
                                                    );
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        </div>

                                        {/* 選択オーバーレイ */}
                                        {isSelected(media.id) && (
                                            <div className="absolute inset-0 bg-indigo-600 bg-opacity-10 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-5 h-5 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}

                                        {/* メディア情報 */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                            <p className="text-xs text-white truncate">
                                                {media.title || media.file_name}
                                            </p>
                                            {media.file_size && (
                                                <p className="text-xs text-slate-200">
                                                    {formatFileSize(
                                                        media.file_size,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <PhotoIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    メディアライブラリに画像がありません
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    上記から新しい画像をアップロードしてください
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* フッター */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <SecondaryButton onClick={handleClose}>
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={confirmSelection}
                        disabled={selectedMediaIds.length === 0}
                    >
                        選択
                        {selectedMediaIds.length > 0 &&
                            ` (${selectedMediaIds.length})`}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
