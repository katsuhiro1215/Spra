import { FormGroup, TextArea, Checkbox } from "@/Components/Forms";
import { RadioGroup } from "@/Components/Forms";

/**
 * ヒアリング質問項目をカテゴリごとに表示し、回答を入力するフォーム部分
 *
 * @param {Object} groupedItems - カテゴリ名 => 質問項目配列
 * @param {Object} answers - hearing_template_item_id => { answer_text, answer_options }
 * @param {(itemId: string, value: object) => void} onChange
 */
export default function HearingAnswerFields({ groupedItems, answers, onChange }) {
    const getAnswer = (itemId) => answers[itemId] || { answer_text: "", answer_options: [] };

    const handleTextChange = (itemId, value) => {
        onChange(itemId, { answer_text: value, answer_options: [] });
    };

    const handleSingleChoiceChange = (itemId, value) => {
        onChange(itemId, { answer_text: "", answer_options: [value] });
    };

    const handleMultiChoiceToggle = (itemId, option, checked) => {
        const current = getAnswer(itemId).answer_options || [];
        const next = checked
            ? [...current, option]
            : current.filter((v) => v !== option);
        onChange(itemId, { answer_text: "", answer_options: next });
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3 pb-2 border-b border-gray-200 dark:border-slate-700">
                        {category}
                    </h3>
                    <div className="space-y-5">
                        {items.map((item) => {
                            const answer = getAnswer(item.id);

                            return (
                                <FormGroup key={item.id} label={item.question}>
                                    {item.type === "single_choice" && (
                                        <RadioGroup
                                            name={`item-${item.id}`}
                                            options={(item.options || []).map((opt) => ({
                                                value: opt,
                                                label: opt,
                                            }))}
                                            value={answer.answer_options?.[0] || ""}
                                            onChange={(value) =>
                                                handleSingleChoiceChange(item.id, value)
                                            }
                                            direction="horizontal"
                                        />
                                    )}

                                    {item.type === "multi_choice" && (
                                        <div className="flex flex-wrap gap-4">
                                            {(item.options || []).map((opt) => (
                                                <Checkbox
                                                    key={opt}
                                                    id={`item-${item.id}-${opt}`}
                                                    label={opt}
                                                    checked={(answer.answer_options || []).includes(opt)}
                                                    onChange={(e) =>
                                                        handleMultiChoiceToggle(
                                                            item.id,
                                                            opt,
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {(item.type === "text" || item.type === "number") && (
                                        <TextArea
                                            rows={2}
                                            value={answer.answer_text || ""}
                                            onChange={(e) =>
                                                handleTextChange(item.id, e.target.value)
                                            }
                                        />
                                    )}
                                </FormGroup>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
