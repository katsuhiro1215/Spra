import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";

const AddressManager = ({
    addresses = [],
    onAddressAdd,
    onAddressUpdate,
    onAddressDelete,
    addressTypes = ["home", "office", "billing", "shipping", "branch", "other"],
    title = "住所管理",
}) => {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleAddNew = () => {
        setEditingAddress(null);
        setShowForm(true);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleSave = async (addressData) => {
        try {
            if (editingAddress) {
                await onAddressUpdate(editingAddress.id, addressData);
            } else {
                await onAddressAdd(addressData);
            }
            setShowForm(false);
            setEditingAddress(null);
        } catch (error) {
            console.error("住所の保存に失敗しました:", error);
            // エラーハンドリングは親コンポーネントで行う
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAddress(null);
    };

    const handleDelete = async (address) => {
        if (window.confirm("この住所を削除してもよろしいですか？")) {
            try {
                await onAddressDelete(address.id);
            } catch (error) {
                console.error("住所の削除に失敗しました:", error);
                // エラーハンドリングは親コンポーネントで行う
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* ヘッダー */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <PlusIcon className="h-4 w-4" />
                        住所を追加
                    </button>
                )}
            </div>

            {/* フォーム */}
            {showForm && (
                <AddressForm
                    address={editingAddress}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    addressTypes={addressTypes}
                />
            )}

            {/* 住所リスト */}
            {!showForm && (
                <AddressList
                    addresses={addresses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default AddressManager;
