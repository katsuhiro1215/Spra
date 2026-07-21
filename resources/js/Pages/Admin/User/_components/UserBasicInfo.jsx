import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import { Dl, Dt, Dd } from "@/Components/Description";
import { IconButton } from "@/Components/Buttons";
import { PencilIcon, PlusIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function UserBasicInfo({ user }) {
    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        プロフィール情報
                    </span>
                </div>
                {user.profile ? (
                    <IconButton
                        icon={PencilIcon}
                        variant="warning-text"
                        size="lg"
                        href={route("admin.user.profile.edit", user.id)}
                        title="編集"
                    />
                ) : (
                    <IconButton
                        icon={PlusIcon}
                        variant="indigo-text"
                        size="lg"
                        href={route("admin.user.profile.create", user.id)}
                        title="作成"
                    />
                )}
            </CardHeader>
            <CardBody>
                {user.profile ? (
                    <Dl variant="striped">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                            <Dt className="font-medium">名前</Dt>
                            <Dd className="sm:col-span-2">
                                {user.profile.full_name}
                            </Dd>
                        </div>
                        {user.profile.full_name_kana && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">名前（カナ）</Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.full_name_kana}
                                </Dd>
                            </div>
                        )}
                        {user.profile.display_name && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">表示名</Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.display_name}
                                </Dd>
                            </div>
                        )}
                        {user.profile.birth_date && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">生年月日</Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.birth_date}
                                </Dd>
                            </div>
                        )}
                        {user.profile.gender && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">性別</Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.gender}
                                </Dd>
                            </div>
                        )}
                        {user.profile.phone && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">電話番号</Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.phone}
                                </Dd>
                            </div>
                        )}
                        {user.profile.mobile && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">携帯電話</Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.mobile}
                                </Dd>
                            </div>
                        )}
                        {user.profile.emergency_contact_name && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">
                                    緊急連絡先氏名
                                </Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.emergency_contact_name}
                                </Dd>
                            </div>
                        )}
                        {user.profile.emergency_contact_phone && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
                                <Dt className="font-medium">
                                    緊急連絡先電話番号
                                </Dt>
                                <Dd className="sm:col-span-2">
                                    {user.profile.emergency_contact_phone}
                                </Dd>
                            </div>
                        )}
                        {user.profile.bio && (
                            <div className="flex flex-col gap-2 py-3">
                                <Dt className="font-medium">自己紹介</Dt>
                                <Dd className="whitespace-pre-wrap">
                                    {user.profile.bio}
                                </Dd>
                            </div>
                        )}
                    </Dl>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-8">
                        プロフィール情報が登録されていません
                    </p>
                )}
            </CardBody>
        </Card>
    );
}
