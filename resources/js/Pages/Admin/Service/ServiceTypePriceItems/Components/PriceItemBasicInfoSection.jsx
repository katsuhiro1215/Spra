import {
    InputLabel,
    TextInput,
    TextArea,
    SelectInput,
    InputError,
} from "@/Components/Forms";

/**
 * 価格項目の基本情報セクション
 */
const PriceItemBasicInfoSection = ({
    data,
    setData,
    errors,
    categories,
    units,
}) => {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    基本情報
                </h3>

                <div className="space-y-6">
                    {/* カテゴリ選択 */}
                    <div>
                        <InputLabel
                            htmlFor="category"
                            value="カテゴリ"
                            required
                        />
                        <SelectInput
                            id="category"
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            className="mt-1 block w-full"
                            required
                        >
                            <option value="">カテゴリを選択</option>
                            {Object.entries(categories).map(([key, name]) => (
                                <option key={key} value={key}>
                                    {name}
                                </option>
                            ))}
                        </SelectInput>
                        <InputError
                            message={errors.category}
                            className="mt-2"
                        />
                    </div>

                    {/* 項目名 */}
                    <div>
                        <InputLabel htmlFor="name" value="項目名" required />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="例: ロゴデザイン"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* 詳細説明 */}
                    <div>
                        <InputLabel htmlFor="description" value="詳細説明" />
                        <TextArea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="mt-1 block w-full"
                            rows={3}
                            placeholder="項目の詳細な説明を入力してください"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceItemBasicInfoSection;
