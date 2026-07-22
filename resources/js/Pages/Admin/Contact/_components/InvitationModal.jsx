import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function InvitationModal({ contact, isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        expires_days: 7,
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.contact.invitation.store", contact.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            ユーザー招待を送信
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            送信先
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {contact.name}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {contact.email}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Expires Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                有効期限（日数）
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.expires_days}
                                onChange={(e) =>
                                    setData(
                                        "expires_days",
                                        parseInt(e.target.value),
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                required
                            >
                                <option value={1}>1日</option>
                                <option value={3}>3日</option>
                                <option value={7}>7日（推奨）</option>
                                <option value={14}>14日</option>
                                <option value={30}>30日</option>
                            </select>
                            {errors.expires_days && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.expires_days}
                                </p>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                メモ（管理用）
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                placeholder="招待に関するメモ（任意）"
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                📧 招待メールが {contact.email} に送信されます。
                                <br />
                                招待リンクは一度のみ使用可能で、指定した日数後に期限切れになります。
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`flex-1 px-4 py-2 text-white rounded-md ${
                                    processing
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                }`}
                            >
                                {processing ? "送信中..." : "招待を送信"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={processing}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                            >
                                キャンセル
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
