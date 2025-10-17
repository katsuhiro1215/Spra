import { InputLabel, InputError } from "@/Components/Forms";

/**
 * 価格項目のオプション設定セクション
 */
const PriceItemOptionsSection = ({ data, setData, errors }) => {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    オプション設定
                </h3>

                <div className="space-y-6">
                    {/* オプション項目 */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_optional}
                                onChange={(e) =>
                                    setData("is_optional", e.target.checked)
                                }
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                オプション項目
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            チェックすると、この項目は任意選択になります
                        </p>
                        <InputError
                            message={errors.is_optional}
                            className="mt-2"
                        />
                    </div>

                    {/* 価格変動項目 */}
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_variable}
                                onChange={(e) =>
                                    setData("is_variable", e.target.checked)
                                }
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                価格変動項目
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            チェックすると、この項目の価格は状況に応じて変動します
                        </p>
                        <InputError
                            message={errors.is_variable}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceItemOptionsSection;
