/**
 * 価格項目のサマリー統計を表示するコンポーネント
 */
const PriceItemsSummary = ({ priceItems, totalPrice }) => {
    const totalItems = Object.values(priceItems).flat().length;
    const categoriesCount = Object.keys(priceItems).length;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(price);
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                            {totalItems}
                        </div>
                        <div className="text-gray-600">総項目数</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {categoriesCount}
                        </div>
                        <div className="text-gray-600">カテゴリ数</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {formatPrice(totalPrice)}
                        </div>
                        <div className="text-gray-600">合計金額</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceItemsSummary;
