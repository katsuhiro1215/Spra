import React from "react";
import { Card, CardHeader, CardBody } from "@/Components/Card";
import {
    FormGroup,
    TextInput,
    TextArea,
    NumberInput,
    InputError,
} from "@/Components/Forms";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const Form = ({
    data,
    errors,
    onMilestoneChange,
    onRemoveMilestone,
    onAddMilestone,
}) => {
    return (
        <div className="space-y-6">
            {/* マイルストーン一覧 */}
            <Card>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        マイルストーン
                        {data.milestones && data.milestones.length > 0 && (
                            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                                ({data.milestones.length}個)
                            </span>
                        )}
                    </h3>
                    <button
                        type="button"
                        onClick={onAddMilestone}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        <PlusIcon className="h-4 w-4" />
                        追加
                    </button>
                </div>
                <CardBody>
                    <div className="space-y-6">
                        {data.milestones && data.milestones.length > 0 ? (
                            data.milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            マイルストーン #{index + 1}
                                        </h4>
                                        {data.milestones.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRemoveMilestone(index)
                                                }
                                                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                title="削除"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <FormGroup
                                            label="マイルストーン名"
                                            required
                                            error={
                                                errors[
                                                    `milestones.${index}.milestone_name`
                                                ]
                                            }
                                        >
                                            <TextInput
                                                value={
                                                    milestone.milestone_name ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    onMilestoneChange(
                                                        index,
                                                        "milestone_name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="例: 要件定義"
                                                error={
                                                    errors[
                                                        `milestones.${index}.milestone_name`
                                                    ]
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `milestones.${index}.milestone_name`
                                                    ]
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup
                                            label="説明"
                                            error={
                                                errors[
                                                    `milestones.${index}.description`
                                                ]
                                            }
                                        >
                                            <TextArea
                                                value={
                                                    milestone.description || ""
                                                }
                                                onChange={(e) =>
                                                    onMilestoneChange(
                                                        index,
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="マイルストーンの説明（オプション）"
                                                rows={2}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `milestones.${index}.description`
                                                    ]
                                                }
                                            />
                                        </FormGroup>

                                        <FormGroup
                                            label="順序"
                                            required
                                            error={
                                                errors[
                                                    `milestones.${index}.order`
                                                ]
                                            }
                                            hint="マイルストーンの表示順序"
                                        >
                                            <NumberInput
                                                value={milestone.order || 0}
                                                onChange={(value) =>
                                                    onMilestoneChange(
                                                        index,
                                                        "order",
                                                        parseInt(value) || 0,
                                                    )
                                                }
                                                min="0"
                                                error={
                                                    errors[
                                                        `milestones.${index}.order`
                                                    ]
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `milestones.${index}.order`
                                                    ]
                                                }
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500 dark:text-slate-400">
                                    マイルストーンが追加されていません
                                </p>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Form;
