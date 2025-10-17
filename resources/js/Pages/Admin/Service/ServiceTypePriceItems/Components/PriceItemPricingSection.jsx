import {
    InputLabel,
    TextInput,
    SelectInput,
    InputError,
} from "@/Components/Forms";

/**
 * 価格項目の価格設定セクション
 */
const PriceItemPricingSection = ({
    data,
    setData,
    errors,
    units,
    totalPrice,
    formatPrice,
}) => {
    const calculateTotal = () => {
        const price = parseFloat(data.price) || 0;
        const quantity = parseInt(data.quantity) || 1;
        return price * quantity;
    };

    const handlePriceChange = (e) => {
        setData("price", e.target.value);
    };

    const handleQuantityChange = (e) => {
        setData("quantity", e.target.value);
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                    価格設定
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 単価 */}
                        <div>
                            <InputLabel htmlFor="price" value="単価" required />
                            <TextInput
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={handlePriceChange}
                                className="mt-1 block w-full"
                                placeholder="0"
                                min="0"
                                step="0.01"
                                required
                            />
                            <InputError
                                message={errors.price}
                                className="mt-2"
                            />
                        </div>

                        {/* 単位 */}
                        <div>
                            <InputLabel htmlFor="unit" value="単位" />
                            <SelectInput
                                id="unit"
                                value={data.unit}
                                onChange={(e) =>
                                    setData("unit", e.target.value)
                                }
                                className="mt-1 block w-full"
                            >
                                {units.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError
                                message={errors.unit}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 数量 */}
                        <div>
                            <InputLabel htmlFor="quantity" value="数量" />
                            <TextInput
                                id="quantity"
                                type="number"
                                value={data.quantity}
                                onChange={handleQuantityChange}
                                className="mt-1 block w-full"
                                min="1"
                                step="1"
                            />
                            <InputError
                                message={errors.quantity}
                                className="mt-2"
                            />
                        </div>

                        {/* 並び順 */}
                        <div>
                            <InputLabel htmlFor="sort_order" value="並び順" />
                            <TextInput
                                id="sort_order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData("sort_order", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="0"
                                min="0"
                            />
                            <InputError
                                message={errors.sort_order}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* 合計金額表示 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                                合計金額
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                                {formatPrice(calculateTotal())}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {formatPrice(parseFloat(data.price) || 0)} ×{" "}
                            {data.quantity || 1}
                            {data.unit}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceItemPricingSection;
