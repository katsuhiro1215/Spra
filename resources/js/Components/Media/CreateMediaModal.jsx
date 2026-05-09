import { useState, useCallback } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import Modal from "@/Components/Layout/Modal";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import {
    TextInput,
    TextArea,
    InputLabel,
    InputError,
} from "@/Components/Forms";
import {
    XMarkIcon,
    PhotoIcon,
    CloudArrowUpIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function CreateMediaModal({ show = false, onClose }) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [data, setData] = useState({
        title: "",
        description: "",
        alt_text: "",
    });

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(
            (file) =>
                file.type.startsWith("image/") ||
                file.type.startsWith("video/"),
        );

        if (imageFiles.length === 0) {
            alert("画像または動画ファイルのみアップロード可能です");
            return;
        }

        handleFiles(imageFiles);
    }, []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        setSelectedFiles(files);

        // プレビューを生成
        const newPreviews = files
            .map((file) => {
                if (file.type.startsWith("image/")) {
                    return {
                        type: "image",
                        url: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size,
                    };
                } else if (file.type.startsWith("video/")) {
                    return {
                        type: "video",
                        url: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size,
                    };
                }
                return null;
            })
            .filter(Boolean);

        setPreviews(newPreviews);
    };

    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // プレビューURLを解放
        if (previews[index]) {
            URL.revokeObjectURL(previews[index].url);
        }

        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            alert("ファイルを選択してください");
            return;
        }

        setProcessing(true);
        setErrors({});

        let successCount = 0;
        let errorCount = 0;

        try {
            // 各ファイルを順次アップロード
            for (const file of selectedFiles) {
                try {
                    const formData = new FormData();
                    formData.append("image", file);

                    // 各ファイルに共通のメタデータを設定
                    if (data.title) formData.append("title", data.title);
                    if (data.description)
                        formData.append("description", data.description);
                    if (data.alt_text)
                        formData.append("alt_text", data.alt_text);

                    const response = await axios.post(
                        route("admin.media.store"),
                        formData,
                        {
                            headers: {
                                Accept: "application/json",
                            },
                        },
                    );

                    if (response.data.success) {
                        successCount++;
                    }
                } catch (error) {
                    console.error("Upload error for file:", file.name, error);
                    errorCount++;
                }
            }

            // 結果をユーザーに通知
            if (successCount > 0) {
                // 成功したらページをリロード（メディア一覧を更新）
                router.reload({ preserveScroll: true });
                handleClose();
            }

            if (errorCount > 0) {
                alert(
                    `${successCount}件のアップロードに成功、${errorCount}件が失敗しました。`,
                );
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("アップロードに失敗しました");
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        // プレビューURLをクリーンアップ
        previews.forEach((preview) => {
            if (preview && preview.url) {
                URL.revokeObjectURL(preview.url);
            }
        });

        setSelectedFiles([]);
        setPreviews([]);
        setData({
            title: "",
            description: "",
            alt_text: "",
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal show={show} maxWidth="2xl" onClose={handleClose}>
            <div className="p-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        メディアをアップロード
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* フォーム */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ドラッグ&ドロップエリア */}
                    {selectedFiles.length === 0 && (
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                                isDragging
                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                    : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                            }`}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                            <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
                                ファイルをドラッグ&ドロップ
                            </p>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                または クリックしてファイルを選択
                            </p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                PNG, JPG, GIF, WebP, MP4 対応
                            </p>
                        </div>
                    )}

                    {/* 選択されたファイルのプレビュー */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    選択されたファイル ({selectedFiles.length})
                                </h4>
                                <label className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    ファイルを追加
                                </label>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {previews.map((preview, index) => (
                                    <div
                                        key={index}
                                        className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                                    >
                                        {preview.type === "image" ? (
                                            <img
                                                src={preview.url}
                                                alt={preview.name}
                                                className="w-full h-32 object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={preview.url}
                                                className="w-full h-32 object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                className="opacity-0 group-hover:opacity-100 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-slate-800">
                                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                                {preview.name}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                {formatFileSize(preview.size)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* メタデータ入力（複数ファイルの場合は共通） */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div>
                                <InputLabel
                                    htmlFor="title"
                                    value="タイトル（オプション）"
                                />
                                <TextInput
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            title: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="全ファイルに共通のタイトル"
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="説明（オプション）"
                                />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            description: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full"
                                    rows={3}
                                    placeholder="ファイルの説明"
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="alt_text"
                                    value="代替テキスト（オプション）"
                                />
                                <TextInput
                                    id="alt_text"
                                    value={data.alt_text}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            alt_text: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="画像の代替テキスト（SEO・アクセシビリティ）"
                                />
                                <InputError
                                    message={errors.alt_text}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    )}

                    {/* フッター */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <SecondaryButton
                            onClick={handleClose}
                            disabled={processing}
                        >
                            キャンセル
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            disabled={processing || selectedFiles.length === 0}
                        >
                            {processing
                                ? "アップロード中..."
                                : `アップロード (${selectedFiles.length})`}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
