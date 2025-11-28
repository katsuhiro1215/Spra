import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { gsap } from "gsap";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    XMarkIcon,
    DocumentTextIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { estimateQuestions } from "@/Data/estimateQuestions";

export default function EstimateSimulator() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // 価格計算
    const calculatePrice = () => {
        let price = 0;
        let multiplier = 1;

        // 質問1: ベース価格
        if (answers[1]) {
            const baseOption = estimateQuestions[0].options.find(
                (opt) => opt.id === answers[1]
            );
            price = baseOption?.basePrice || 0;
        }

        // 質問2: 規模による倍率
        if (answers[2]) {
            const scaleOption = estimateQuestions[1].options.find(
                (opt) => opt.id === answers[2]
            );
            multiplier *= scaleOption?.priceMultiplier || 1;
        }

        // 質問3: 機能追加（複数選択）
        if (answers[3] && Array.isArray(answers[3])) {
            answers[3].forEach((selectedId) => {
                const featureOption = estimateQuestions[2].options.find(
                    (opt) => opt.id === selectedId
                );
                price += featureOption?.price || 0;
            });
        }

        // 質問4: デザイン
        if (answers[4]) {
            const designOption = estimateQuestions[3].options.find(
                (opt) => opt.id === answers[4]
            );
            price += designOption?.price || 0;
        }

        // 質問5: 納期による倍率
        if (answers[5]) {
            const scheduleOption = estimateQuestions[4].options.find(
                (opt) => opt.id === answers[5]
            );
            multiplier *= scheduleOption?.priceMultiplier || 1;
        }

        return Math.round(price * multiplier);
    };

    // 回答更新
    const handleAnswer = (questionId, optionId) => {
        const question = estimateQuestions[currentStep];

        if (question.type === "multiple") {
            // 複数選択
            const currentAnswers = answers[questionId] || [];
            const newAnswers = currentAnswers.includes(optionId)
                ? currentAnswers.filter((id) => id !== optionId)
                : [...currentAnswers, optionId];

            setAnswers({ ...answers, [questionId]: newAnswers });
        } else {
            // 単一選択
            setAnswers({ ...answers, [questionId]: optionId });
        }
    };

    // 次へ
    const handleNext = () => {
        if (currentStep < estimateQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            const finalPrice = calculatePrice();
            setTotalPrice(finalPrice);
            setShowResult(true);
        }
    };

    // 戻る
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // やり直し
    const handleReset = () => {
        setCurrentStep(0);
        setAnswers({});
        setTotalPrice(0);
        setShowResult(false);
    };

    // アニメーション
    useEffect(() => {
        gsap.fromTo(
            ".question-container",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
    }, [currentStep]);

    const currentQuestion = estimateQuestions[currentStep];
    const progress = ((currentStep + 1) / estimateQuestions.length) * 100;
    const canProceed =
        answers[currentQuestion?.id] !== undefined &&
        (currentQuestion?.type === "multiple"
            ? answers[currentQuestion.id].length > 0
            : true);

    // 結果画面
    if (showResult) {
        return (
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
                            ご回答いただいた内容から算出しました
                        </p>
                    </div>

                    {/* 見積もり金額 */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white text-center">
                        <p className="text-lg mb-2 opacity-90">
                            概算お見積もり
                        </p>
                        <p className="text-5xl md:text-6xl font-bold mb-2">
                            ¥{totalPrice.toLocaleString()}
                            <span className="text-2xl ml-2">〜</span>
                        </p>
                        <p className="text-sm opacity-80">（税別）</p>
                    </div>

                    {/* 注意喚起 */}
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
                            {estimateQuestions.map((question) => {
                                const answer = answers[question.id];
                                if (!answer) return null;

                                if (question.type === "multiple") {
                                    const selectedOptions =
                                        question.options.filter((opt) =>
                                            answer.includes(opt.id)
                                        );
                                    return (
                                        <div
                                            key={question.id}
                                            className="flex items-start gap-3 text-sm"
                                        >
                                            <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-gray-700">
                                                    {question.question}
                                                </span>
                                                <br />
                                                <span className="text-gray-600">
                                                    {selectedOptions
                                                        .map((opt) => opt.label)
                                                        .join(", ")}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    const selectedOption =
                                        question.options.find(
                                            (opt) => opt.id === answer
                                        );
                                    return (
                                        <div
                                            key={question.id}
                                            className="flex items-start gap-3 text-sm"
                                        >
                                            <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-gray-700">
                                                    {question.question}
                                                </span>
                                                <br />
                                                <span className="text-gray-600">
                                                    {selectedOption?.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="grid md:grid-cols-2 gap-4">
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
        );
    }

    // 質問画面
    return (
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
                            {currentStep + 1} / {estimateQuestions.length}
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

            {/* 質問エリア */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="question-container max-w-4xl w-full">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        {/* 質問タイトル */}
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                            {currentQuestion.question}
                        </h2>

                        {/* 選択肢 */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {currentQuestion.options.map((option) => {
                                const isSelected =
                                    currentQuestion.type === "multiple"
                                        ? (
                                              answers[currentQuestion.id] || []
                                          ).includes(option.id)
                                        : answers[currentQuestion.id] ===
                                          option.id;

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() =>
                                            handleAnswer(
                                                currentQuestion.id,
                                                option.id
                                            )
                                        }
                                        className={`group relative p-6 rounded-xl border-2 transition-all transform hover:-translate-y-1 ${
                                            isSelected
                                                ? "border-purple-600 bg-purple-50 shadow-lg"
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                    >
                                        {/* チェックマーク */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                                <CheckIcon className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        {/* アイコン */}
                                        <div className="text-4xl mb-3">
                                            {option.icon}
                                        </div>

                                        {/* ラベル */}
                                        <h3
                                            className={`text-lg font-bold mb-2 ${
                                                isSelected
                                                    ? "text-purple-600"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {option.label}
                                        </h3>

                                        {/* 説明 */}
                                        <p className="text-sm text-gray-600 mb-3">
                                            {option.description}
                                        </p>

                                        {/* 価格表示 */}
                                        {option.basePrice && (
                                            <p className="text-sm font-semibold text-blue-600">
                                                ¥
                                                {option.basePrice.toLocaleString()}
                                                〜
                                            </p>
                                        )}
                                        {option.price !== undefined && (
                                            <p className="text-sm font-semibold text-blue-600">
                                                +¥
                                                {option.price.toLocaleString()}
                                            </p>
                                        )}
                                        {option.priceMultiplier && (
                                            <p className="text-sm font-semibold text-blue-600">
                                                ×{option.priceMultiplier}倍
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* ナビゲーションボタン */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                    currentStep === 0
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md"
                                }`}
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                戻る
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!canProceed}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                                    canProceed
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {currentStep < estimateQuestions.length - 1
                                    ? "次へ"
                                    : "結果を見る"}
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 複数選択の場合のヒント */}
                        {currentQuestion.type === "multiple" && (
                            <p className="text-center text-sm text-gray-500 mt-4">
                                ※ 複数選択可能です
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
