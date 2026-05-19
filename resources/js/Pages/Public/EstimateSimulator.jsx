import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { gsap } from "gsap";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    XMarkIcon,
    EnvelopeIcon,
    BookmarkIcon,
} from "@heroicons/react/24/outline";

export default function EstimateSimulator({
    auth,
    serviceCategories = [],
    services = {},
    servicePlans = {},
    serviceItems = {},
    canLogin = null,
    canRegister = null,
}) {
    // ========================================
    // State管理
    // ========================================
    const [currentStep, setCurrentStep] = useState(0); // 0: カテゴリ, 1: サービス, 2: プラン, 3: 追加機能, 4: 結果
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [showResult, setShowResult] = useState(false);

    // ========================================
    // 価格計算
    // ========================================
    const calculatePrice = () => {
        let basePrice = 0;
        let addonPrice = 0;

        // プラン基本価格
        if (selectedPlan) {
            basePrice = parseFloat(selectedPlan.price) || 0;
        }

        // 追加機能価格
        selectedAddons.forEach((addon) => {
            addonPrice += parseFloat(addon.price) || 0;
        });

        const subtotal = basePrice + addonPrice;
        const tax = Math.round(subtotal * 0.1); // 消費税10%
        const total = subtotal + tax;

        return { basePrice, addonPrice, subtotal, tax, total };
    };

    const { basePrice, addonPrice, subtotal, tax, total } = calculatePrice();

    // ========================================
    // ステップごとの選択肢を取得
    // ========================================
    const getAvailableServices = () => {
        if (!selectedCategory) return [];
        return services[selectedCategory.id] || [];
    };

    const getAvailablePlans = () => {
        if (!selectedService) return [];
        return servicePlans[selectedService.id] || [];
    };

    const getAvailableAddons = () => {
        if (!selectedService) return [];
        // ServiceItemsをフィルタリングしてaddon typeのみ取得
        const allItems = Object.values(serviceItems).flat();
        return allItems.filter(
            (item) =>
                item.service_id === selectedService.id &&
                item.item_type === "addon",
        );
    };

    // プランに含まれる項目を取得
    const getPlanIncludedItems = (planId) => {
        const allItems = Object.values(serviceItems).flat();
        return allItems.filter(
            (item) =>
                item.service_plan_id === planId &&
                item.item_type === "included",
        );
    };

    // 納期を計算
    const calculateEstimatedDays = () => {
        let totalDays = 0;

        // プランの納期
        if (selectedPlan) {
            const planItems = getPlanIncludedItems(selectedPlan.id);
            planItems.forEach((item) => {
                totalDays += parseInt(item.estimated_days) || 0;
            });
        }

        // 追加機能の納期
        selectedAddons.forEach((addon) => {
            totalDays += parseInt(addon.estimated_days) || 0;
        });

        return totalDays;
    };

    const estimatedDays = calculateEstimatedDays();

    // ========================================
    // ハンドラー - カテゴリ選択
    // ========================================
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setSelectedService(null);
        setSelectedPlan(null);
        setSelectedAddons([]);
        setCurrentStep(1); // サービス選択へ
    };

    // ========================================
    // ハンドラー - サービス選択
    // ========================================
    const handleSelectService = (service) => {
        setSelectedService(service);
        setSelectedPlan(null);
        setSelectedAddons([]);
        setCurrentStep(2); // プラン選択へ
    };

    // ========================================
    // ハンドラー - プラン選択
    // ========================================
    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setSelectedAddons([]);
        setCurrentStep(3); // 追加機能選択へ
    };

    // ========================================
    // ハンドラー - 追加機能選択（複数選択可能）
    // ========================================
    const handleToggleAddon = (addon) => {
        const isSelected = selectedAddons.some((a) => a.id === addon.id);
        if (isSelected) {
            setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
        } else {
            setSelectedAddons([...selectedAddons, addon]);
        }
    };

    // ========================================
    // ハンドラー - 結果表示
    // ========================================
    const handleShowResult = () => {
        setShowResult(true);
    };

    // ========================================
    // ハンドラー - リセット
    // ========================================
    const handleReset = () => {
        setCurrentStep(0);
        setSelectedCategory(null);
        setSelectedService(null);
        setSelectedPlan(null);
        setSelectedAddons([]);
        setShowResult(false);
    };

    // ========================================
    // ハンドラー - 見積もり依頼を保存
    // ========================================
    const handleSaveInquiry = () => {
        const inquiryData = {
            service_category_id: selectedCategory?.id,
            service_id: selectedService?.id,
            service_plan_id: selectedPlan?.id,
            simulator_data: {
                selected_addons: selectedAddons.map((addon) => ({
                    id: addon.id,
                    name: addon.name,
                    price: addon.price,
                    estimated_days: addon.estimated_days,
                })),
            },
            estimated_price: total,
            estimated_days: estimatedDays,
            title: `${selectedService?.name} - ${selectedPlan?.name}`,
            summary: `見積もりシミュレーターから作成された見積もり依頼です。`,
        };

        router.post(route("estimate.simulator.save"), inquiryData, {
            onSuccess: () => {
                alert("見積もり依頼を保存しました！");
            },
            onError: (errors) => {
                console.error("保存エラー:", errors);
                alert("保存に失敗しました。もう一度お試しください。");
            },
        });
    };

    // ========================================
    // ハンドラー - 戻る
    // ========================================
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setShowResult(false);
        }
    };

    // ========================================
    // アニメーション
    // ========================================
    useEffect(() => {
        gsap.fromTo(
            ".step-container",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        );
    }, [currentStep, showResult]);

    // ========================================
    // ヘルパー - 金額フォーマット
    // ========================================
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("ja-JP", {
            style: "currency",
            currency: "JPY",
        }).format(amount || 0);
    };

    // ========================================
    // ヘルパー - カテゴリアイコン
    // ========================================
    const getCategoryIcon = (categoryName) => {
        const iconMap = {
            Web制作: "🌐",
            Webサイト制作: "🌐",
            システム開発: "💻",
            アプリ開発: "📱",
            ECサイト: "🛒",
            デザイン: "🎨",
            マーケティング: "📈",
            コンサルティング: "💡",
        };

        for (const [key, icon] of Object.entries(iconMap)) {
            if (categoryName.includes(key)) {
                return icon;
            }
        }
        return "✨";
    };

    // ========================================
    // プログレス計算
    // ========================================
    const totalSteps = 4;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    // ========================================
    // 結果画面
    // ========================================
    if (showResult) {
        return (
            <PublicLayout>
                <Head title="見積もり結果 - 見積もりシミュレーター" />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
                    <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                                <CheckIcon className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                お見積もり結果
                            </h2>
                            <p className="text-gray-600">
                                ご選択いただいた内容から算出しました
                            </p>
                        </div>

                        {/* 見積もり金額 */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white text-center">
                            <p className="text-lg mb-2 opacity-90">
                                概算お見積もり
                            </p>
                            <p className="text-5xl md:text-6xl font-bold mb-2">
                                {formatAmount(total)}
                                <span className="text-2xl ml-2">〜</span>
                            </p>
                            <p className="text-sm opacity-80">（税込）</p>
                        </div>

                        {/* 価格内訳 */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                価格内訳
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">
                                        プラン基本料金:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatAmount(basePrice)}
                                    </span>
                                </div>
                                {addonPrice > 0 && (
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-600">
                                            追加機能:
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {formatAmount(addonPrice)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base pt-3 border-t">
                                    <span className="text-gray-600">小計:</span>
                                    <span className="font-medium text-gray-900">
                                        {formatAmount(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-gray-600">
                                        消費税 (10%):
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatAmount(tax)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-3 border-t-2 border-gray-300">
                                    <span className="text-gray-900">合計:</span>
                                    <span className="text-indigo-600">
                                        {formatAmount(total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 納期表示 */}
                        {estimatedDays > 0 && (
                            <div className="bg-blue-50 rounded-xl p-6 mb-8 text-center">
                                <p className="text-sm text-blue-600 font-medium mb-2">
                                    想定納期
                                </p>
                                <p className="text-3xl font-bold text-blue-900">
                                    約 {estimatedDays} 日
                                </p>
                                <p className="text-xs text-blue-600 mt-2">
                                    ※実際の納期はプロジェクトの詳細により変動します
                                </p>
                            </div>
                        )}

                        {/* 注意書き */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-yellow-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-800">
                                        <strong className="font-bold">
                                            ご注意ください：
                                        </strong>
                                        <br />
                                        こちらはあくまでも目安の金額です。詳細なヒアリング後、正式なお見積もりをご提示いたします。
                                        プロジェクトの内容により金額が変動する場合がございます。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 選択内容サマリー */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                選択内容
                            </h3>
                            <div className="space-y-3">
                                {selectedCategory && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-gray-700">
                                                カテゴリ:
                                            </span>
                                            <br />
                                            <span className="text-gray-600">
                                                {selectedCategory.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {selectedService && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-gray-700">
                                                サービス:
                                            </span>
                                            <br />
                                            <span className="text-gray-600">
                                                {selectedService.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {selectedPlan && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-gray-700">
                                                プラン:
                                            </span>
                                            <br />
                                            <span className="text-gray-600">
                                                {selectedPlan.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {selectedAddons.length > 0 && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-gray-700">
                                                追加機能:
                                            </span>
                                            <br />
                                            <span className="text-gray-600">
                                                {selectedAddons
                                                    .map((a) => a.name)
                                                    .join(", ")}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* アクションボタン */}
                        <div
                            className={`grid ${auth?.user ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4 mb-4`}
                        >
                            {auth?.user && (
                                <button
                                    onClick={handleSaveInquiry}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                >
                                    <BookmarkIcon className="w-5 h-5" />
                                    見積もり依頼を保存
                                </button>
                            )}
                            <Link
                                href="/contact"
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                <EnvelopeIcon className="w-5 h-5" />
                                お問い合わせ
                            </Link>
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-gray-400 hover:shadow-md transition-all"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                最初からやり直す
                            </button>
                        </div>

                        {/* ログイン/会員登録CTA（非認証ユーザーのみ） */}
                        {!auth?.user && (canLogin || canRegister) && (
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white text-center mb-4">
                                <h3 className="text-xl font-bold mb-2">
                                    この内容で正式な見積もりを依頼しますか？
                                </h3>
                                <p className="text-indigo-100 mb-4 text-sm">
                                    会員登録（無料）することで、正式な見積もりを依頼できます
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    {canLogin && (
                                        <Link
                                            href={canLogin}
                                            className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 transition-colors"
                                        >
                                            ログイン
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href={canRegister}
                                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors shadow-sm"
                                        >
                                            無料会員登録
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ホームへ戻る */}
                        <div className="text-center mt-6">
                            <Link
                                href="/"
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                ホームへ戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    // ========================================
    // ステップ画面のレンダリング
    // ========================================
    const renderStepContent = () => {
        // ステップ0: カテゴリ選択
        if (currentStep === 0) {
            return (
                <div className="step-container">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                        どのようなサービスをお探しですか？
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        ご希望のカテゴリを選択してください
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {serviceCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleSelectCategory(category)}
                                className="group p-6 rounded-xl border-2 border-gray-200 hover:border-purple-600 hover:shadow-lg transition-all transform hover:-translate-y-1 text-left"
                            >
                                <div className="text-4xl mb-3">
                                    {getCategoryIcon(category.name)}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 mb-2">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="text-sm text-gray-600">
                                        {category.description}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // ステップ1: サービス選択
        if (currentStep === 1) {
            const availableServices = getAvailableServices();
            return (
                <div className="step-container">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                        サービスを選択してください
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        {selectedCategory?.name} カテゴリのサービス
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        {availableServices.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => handleSelectService(service)}
                                className="group p-6 rounded-xl border-2 border-gray-200 hover:border-purple-600 hover:shadow-lg transition-all transform hover:-translate-y-1 text-left"
                            >
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 mb-2">
                                    {service.name}
                                </h3>
                                {service.description && (
                                    <p className="text-sm text-gray-600">
                                        {service.description}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        // ステップ2: プラン選択
        if (currentStep === 2) {
            const availablePlans = getAvailablePlans();
            return (
                <div className="step-container">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                        プランを選択してください
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        {selectedService?.name} のプラン
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availablePlans.map((plan) => {
                            const includedItems = getPlanIncludedItems(plan.id);
                            return (
                                <button
                                    key={plan.id}
                                    onClick={() => handleSelectPlan(plan)}
                                    className="group p-6 rounded-xl border-2 border-gray-200 hover:border-purple-600 hover:shadow-lg transition-all transform hover:-translate-y-1 text-left"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 mb-2">
                                        {plan.name}
                                    </h3>
                                    {plan.description && (
                                        <p className="text-sm text-gray-600 mb-3">
                                            {plan.description}
                                        </p>
                                    )}
                                    <p className="text-2xl font-bold text-blue-600 mb-4">
                                        {formatAmount(plan.price)}
                                    </p>

                                    {/* 含まれる項目を表示 */}
                                    {includedItems.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">
                                                このプランに含まれる項目:
                                            </p>
                                            <ul className="space-y-1">
                                                {includedItems
                                                    .slice(0, 5)
                                                    .map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className="text-xs text-gray-600 flex items-start gap-1"
                                                        >
                                                            <CheckIcon className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                                                            <span>
                                                                {item.name}
                                                            </span>
                                                        </li>
                                                    ))}
                                                {includedItems.length > 5 && (
                                                    <li className="text-xs text-gray-500 italic">
                                                        他{" "}
                                                        {includedItems.length -
                                                            5}{" "}
                                                        件...
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }

        // ステップ3: 追加機能選択
        if (currentStep === 3) {
            const availableAddons = getAvailableAddons();
            return (
                <div className="step-container">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                        追加機能を選択してください（複数選択可）
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        必要な追加機能を選択してください（スキップも可能）
                    </p>
                    {availableAddons.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {availableAddons.map((addon) => {
                                const isSelected = selectedAddons.some(
                                    (a) => a.id === addon.id,
                                );
                                return (
                                    <button
                                        key={addon.id}
                                        onClick={() => handleToggleAddon(addon)}
                                        className={`group relative p-6 rounded-xl border-2 transition-all transform hover:-translate-y-1 text-left ${
                                            isSelected
                                                ? "border-purple-600 bg-purple-50 shadow-lg"
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <h3
                                            className={`text-lg font-bold mb-2 ${
                                                isSelected
                                                    ? "text-purple-600"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {addon.name}
                                        </h3>
                                        {addon.description && (
                                            <p className="text-sm text-gray-600 mb-3">
                                                {addon.description}
                                            </p>
                                        )}
                                        <p className="text-lg font-bold text-blue-600">
                                            +{formatAmount(addon.price)}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 mb-8">
                            <p>このサービスには追加機能がありません</p>
                        </div>
                    )}
                    <div className="text-center">
                        <button
                            onClick={handleShowResult}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                        >
                            見積もり結果を見る
                            <ArrowRightIcon className="inline-block w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    // ========================================
    // メイン画面
    // ========================================
    return (
        <PublicLayout>
            <Head title="見積もりシミュレーター" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
                {/* ヘッダー */}
                <div className="bg-white shadow-md">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-gray-900">
                                お見積もりシミュレーター
                            </h1>
                            <Link
                                href="/"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* プログレスバー */}
                <div className="bg-white shadow-sm">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                ステップ {currentStep + 1} / {totalSteps}
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* メインコンテンツ */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        {renderStepContent()}

                        {/* ナビゲーションボタン */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    currentStep === 0
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                戻る
                            </button>

                            <button
                                onClick={handleReset}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                最初からやり直す
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
