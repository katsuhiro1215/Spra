import { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { gsap } from "gsap";
import PublicLayout from "@/Layouts/PublicLayout";
import RenewedPageHero from "@/Components/PublicSite/RenewedPageHero";
import { PublicFlashMessage } from "@/Components/Notifications";
import { Arrow, ROUTES, SiteLink } from "@/Components/PublicSite/links";
import { CheckIcon } from "@heroicons/react/24/outline";

/*
 * 見積もりシミュレーター（試作 estimate/index.html の移植。レイアウト・配色のみ）。
 * 状態管理・価格計算・送信ロジックは既存のまま。
 * 試作は「選ぶ→次へ」の明示ボタン式だが、実装は選んだ瞬間に次のステップへ進む方式のため、
 * そこは変えずに .answer-option の見た目だけを流用している
 */
export default function EstimateSimulator({
    serviceCategories = [],
    services = {},
    servicePlans = {},
    serviceItems = {},
    servicePlanItems = {},
    canLogin = null,
    canRegister = null,
}) {
    const { props } = usePage();
    const auth = props.auth;
    const pageErrors = props.errors;

    // ========================================
    // State管理
    // ========================================
    const [currentStep, setCurrentStep] = useState(0); // 0: カテゴリ, 1: サービス, 2: プラン, 3: 追加機能, 4: 結果
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [requesterName, setRequesterName] = useState("");
    const [requesterEmail, setRequesterEmail] = useState("");
    const [requesterPhone, setRequesterPhone] = useState("");
    const [requesterCompany, setRequesterCompany] = useState("");
    const [requestNotes, setRequestNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // ========================================
    // 価格計算
    // ========================================
    const calculatePrice = () => {
        let basePrice = 0;
        let addonPrice = 0;

        // プラン基本価格
        if (selectedPlan) {
            basePrice = parseFloat(selectedPlan.base_price) || 0;
        }

        // 追加機能価格
        selectedAddons.forEach((addon) => {
            addonPrice += parseFloat(addon.standard_price) || 0;
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

    // 追加オプション（プラン固有オプション + 全プラン共通オプション）を取得
    // プラン固有オプション(optional)の方がそのサービスに合わせた選択肢として意味があるため、先に表示する
    const getAvailableOptions = () => {
        if (!selectedService) return [];
        const items = serviceItems[selectedService.id] || [];
        const typeOrder = { optional: 0, addon: 1 };
        return items
            .filter((item) => item.item_type === "optional" || item.item_type === "addon")
            .sort((a, b) => (typeOrder[a.item_type] ?? 99) - (typeOrder[b.item_type] ?? 99));
    };

    // プランに含まれる項目を取得（service_plan_items 中間テーブル経由）
    const getPlanIncludedItems = (planId) => {
        return servicePlanItems[planId] || [];
    };

    // 選択中のプランに、そのオプションが既に含まれているか（service_item_id で突合）
    const getIncludedItemIds = () => {
        if (!selectedPlan) return new Set();
        return new Set(getPlanIncludedItems(selectedPlan.id).map((item) => item.id));
    };

    // 納期を計算
    const calculateEstimatedDays = () => {
        let totalDays = 0;

        // プランの納期
        if (selectedPlan) {
            // プラン自体の標準納期（プランに含まれる項目の制作期間を織り込んだ目安日数）
            totalDays += parseInt(selectedPlan.estimated_delivery_days) || 0;

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
        // プランに既に含まれているオプションは選択対象外（誤って二重計上させない）
        if (getIncludedItemIds().has(addon.id)) return;

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
    // ハンドラー - 見積もり依頼を送信
    // ========================================
    const handleSaveInquiry = () => {
        const inquiryData = {
            service_id: selectedService?.id,
            service_plan_id: selectedPlan?.id,
            selected_addon_ids: selectedAddons.map((addon) => addon.id),
            estimated_price: total,
            estimated_days: estimatedDays,
            title: `${selectedService?.name} - ${selectedPlan?.name}`,
            notes: requestNotes,
            ...(auth?.user
                ? {}
                : {
                      name: requesterName,
                      email: requesterEmail,
                      phone: requesterPhone,
                      company: requesterCompany,
                  }),
        };

        setSubmitting(true);
        router.post(route("estimate.simulator.save"), inquiryData, {
            onFinish: () => setSubmitting(false),
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
        gsap.fromTo(".step-container", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
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
    // プログレス計算
    // ========================================
    const totalSteps = 4;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const hero = (
        <RenewedPageHero
            eyebrow="QUICK ESTIMATE"
            title={
                <>
                    まずは、予算感を。
                    <br />
                    そこから、考えよう。
                </>
            }
            lead="約1分・登録不要。いくつか選ぶだけで、費用の目安を確認。決まっていない項目があっても大丈夫です。"
            current="料金の目安"
        />
    );

    // ========================================
    // 結果画面
    // ========================================
    if (showResult) {
        return (
            <PublicLayout renewed>
                <Head title="見積もり結果 - 見積もりシミュレーター" />
                <PublicFlashMessage />
                {hero}
                <section className="estimate-layout shell page-section">
                    <aside className="estimate-aside">
                        <span className="estimate-clock">
                            1<span>min.</span>
                        </span>
                        <h2>
                            相談前の、
                            <br />
                            小さな準備。
                        </h2>
                        <p>選んだ内容は、そのままお問い合わせへ引き継げます。</p>
                    </aside>
                    <div className="estimate-panel">
                        <p className="eyebrow">YOUR ESTIMATE / 概算結果</p>
                        <h2>費用の目安ができました。</h2>
                        <p className="result-price">
                            {formatAmount(total)}
                            <small> 〜（税込）</small>
                        </p>

                        <dl className="definition-list">
                            <div>
                                <dt>プラン基本料金</dt>
                                <dd>{formatAmount(basePrice)}</dd>
                            </div>
                            {addonPrice > 0 && (
                                <div>
                                    <dt>オプション</dt>
                                    <dd>{formatAmount(addonPrice)}</dd>
                                </div>
                            )}
                            <div>
                                <dt>小計</dt>
                                <dd>{formatAmount(subtotal)}</dd>
                            </div>
                            <div>
                                <dt>消費税（10%）</dt>
                                <dd>{formatAmount(tax)}</dd>
                            </div>
                            {estimatedDays > 0 && (
                                <div>
                                    <dt>想定納期</dt>
                                    <dd>約 {estimatedDays} 日</dd>
                                </div>
                            )}
                            {selectedCategory && (
                                <div>
                                    <dt>カテゴリ</dt>
                                    <dd>{selectedCategory.name}</dd>
                                </div>
                            )}
                            {selectedService && (
                                <div>
                                    <dt>サービス</dt>
                                    <dd>{selectedService.name}</dd>
                                </div>
                            )}
                            {selectedPlan && (
                                <div>
                                    <dt>プラン</dt>
                                    <dd>{selectedPlan.name}</dd>
                                </div>
                            )}
                            {selectedAddons.length > 0 && (
                                <div>
                                    <dt>オプション内容</dt>
                                    <dd>{selectedAddons.map((a) => a.name).join("、")}</dd>
                                </div>
                            )}
                        </dl>

                        <p className="note">
                            税別の参考値です。あくまでも目安の金額のため、詳細なヒアリング後に正式なお見積もりをご提示します。実際の納期はプロジェクトの詳細により変動します。
                        </p>

                        <div className="inherited-estimate">
                            <h2>この内容で見積もりを依頼する</h2>
                            {!auth?.user && (
                                <>
                                    <div className="form-row">
                                        <label>
                                            お名前 <span className="required">必須</span>
                                            <input
                                                type="text"
                                                value={requesterName}
                                                onChange={(e) => setRequesterName(e.target.value)}
                                                placeholder="山田 太郎"
                                            />
                                            {pageErrors?.name && <p className="form-error">{pageErrors.name}</p>}
                                        </label>
                                        <label>
                                            メールアドレス <span className="required">必須</span>
                                            <input
                                                type="email"
                                                value={requesterEmail}
                                                onChange={(e) => setRequesterEmail(e.target.value)}
                                                placeholder="example@email.com"
                                            />
                                            {pageErrors?.email && <p className="form-error">{pageErrors.email}</p>}
                                        </label>
                                    </div>
                                    <div className="form-row">
                                        <label>
                                            電話番号 <span className="optional">任意</span>
                                            <input
                                                type="tel"
                                                value={requesterPhone}
                                                onChange={(e) => setRequesterPhone(e.target.value)}
                                                placeholder="090-1234-5678"
                                            />
                                        </label>
                                        <label>
                                            会社名・団体名 <span className="optional">任意</span>
                                            <input
                                                type="text"
                                                value={requesterCompany}
                                                onChange={(e) => setRequesterCompany(e.target.value)}
                                                placeholder="○○○ 株式会社"
                                            />
                                        </label>
                                    </div>
                                </>
                            )}
                            <label>
                                ご質問・ご要望 <span className="optional">任意</span>
                                <textarea
                                    value={requestNotes}
                                    onChange={(e) => setRequestNotes(e.target.value)}
                                    rows={4}
                                    placeholder="例：どんなサイトなのか、もう少し詳しく相談したい／少し予算を抑えられないか、など"
                                />
                                {pageErrors?.notes && <p className="form-error">{pageErrors.notes}</p>}
                            </label>
                            <button className="button" type="button" onClick={handleSaveInquiry} disabled={submitting}>
                                {submitting ? "送信中..." : "この内容で見積もりを依頼する"} <Arrow />
                            </button>
                        </div>

                        <div className="review-links">
                            <SiteLink href={ROUTES.contact}>
                                その他のお問い合わせ <Arrow />
                            </SiteLink>
                            <button type="button" id="estimate-restart" className="text-link" onClick={handleReset}>
                                条件を変えて試す ↻
                            </button>
                        </div>

                        {!auth?.user && (canLogin || canRegister) && (
                            <div className="inherited-estimate">
                                <h2>会員登録すると、やり取りがもっと便利になります</h2>
                                <p>会員登録（無料）すると、見積もりや契約の進捗をいつでもマイページで確認できます。</p>
                                <div className="cta-pair">
                                    {canLogin && (
                                        <Link className="text-link" href={canLogin}>
                                            ログイン <Arrow />
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link className="button" href={canRegister}>
                                            無料会員登録 <Arrow />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
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
                    <fieldset>
                        <legend>どのようなサービスをお探しですか？</legend>
                        <p className="question-help">ご希望のカテゴリを選択してください</p>
                        <div className="answer-grid">
                            {serviceCategories.map((category) => (
                                <button key={category.id} type="button" className="answer-option" onClick={() => handleSelectCategory(category)}>
                                    <span>
                                        {category.name}
                                        {category.description && <small>{category.description}</small>}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </fieldset>
                </div>
            );
        }

        // ステップ1: サービス選択
        if (currentStep === 1) {
            const availableServices = getAvailableServices();
            return (
                <div className="step-container">
                    <fieldset>
                        <legend>サービスを選択してください</legend>
                        <p className="question-help">{selectedCategory?.name} カテゴリのサービス</p>
                        <div className="answer-grid">
                            {availableServices.map((service) => (
                                <button key={service.id} type="button" className="answer-option" onClick={() => handleSelectService(service)}>
                                    <span>
                                        {service.name}
                                        {service.description && <small>{service.description}</small>}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </fieldset>
                </div>
            );
        }

        // ステップ2: プラン選択
        if (currentStep === 2) {
            const availablePlans = getAvailablePlans();
            return (
                <div className="step-container">
                    <fieldset>
                        <legend>プランを選択してください</legend>
                        <p className="question-help">{selectedService?.name} のプラン</p>
                        <div className="plan-grid">
                            {availablePlans.map((plan) => {
                                const includedItems = getPlanIncludedItems(plan.id);
                                return (
                                    <button key={plan.id} type="button" className="price-entry" onClick={() => handleSelectPlan(plan)}>
                                        <h3>{plan.name}</h3>
                                        {plan.description && <p>{plan.description}</p>}
                                        <small>{formatAmount(plan.base_price)}</small>
                                        {includedItems.length > 0 && (
                                            <ul className="included-list">
                                                {includedItems.slice(0, 5).map((item) => (
                                                    <li key={item.id}>
                                                        <CheckIcon aria-hidden="true" /> {item.name}
                                                    </li>
                                                ))}
                                                {includedItems.length > 5 && <li>他 {includedItems.length - 5} 件...</li>}
                                            </ul>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>
                </div>
            );
        }

        // ステップ3: オプション選択
        if (currentStep === 3) {
            const availableOptions = getAvailableOptions();
            const includedItemIds = getIncludedItemIds();
            return (
                <div className="step-container">
                    <fieldset>
                        <legend>オプションを選択してください（複数選択可）</legend>
                        <p className="question-help">必要なオプションを選択してください（スキップも可能）</p>
                        {availableOptions.length > 0 ? (
                            <div className="answer-grid">
                                {availableOptions.map((option) => {
                                    const isIncluded = includedItemIds.has(option.id);
                                    const isSelected = selectedAddons.some((a) => a.id === option.id);
                                    const typeLabel = option.item_type === "optional" ? "このサービス限定" : "共通オプション";

                                    if (isIncluded) {
                                        return (
                                            <div className="answer-option selected" key={option.id}>
                                                <span>
                                                    {option.name}（含まれています）
                                                    {option.description && <small>{option.description}</small>}
                                                    <small>選択中のプランの料金に含まれているため、追加料金はかかりません</small>
                                                </span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={`answer-option${isSelected ? " selected" : ""}`}
                                            onClick={() => handleToggleAddon(option)}
                                        >
                                            <span>
                                                {option.name}（{typeLabel}）
                                                {option.description && <small>{option.description}</small>}
                                                <small>+{formatAmount(option.standard_price)}</small>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="note">このサービスには追加オプションがありません</p>
                        )}
                        <div className="estimate-actions">
                            <span />
                            <button type="button" className="button" onClick={handleShowResult}>
                                見積もり結果を見る <Arrow />
                            </button>
                        </div>
                    </fieldset>
                </div>
            );
        }

        return null;
    };

    // ========================================
    // メイン画面
    // ========================================
    return (
        <PublicLayout renewed>
            <Head title="見積もりシミュレーター" />
            <PublicFlashMessage />
            {hero}
            <section className="estimate-layout shell page-section">
                <aside className="estimate-aside">
                    <span className="estimate-clock">
                        1<span>min.</span>
                    </span>
                    <h2>
                        相談前の、
                        <br />
                        小さな準備。
                    </h2>
                    <p>
                        初期費用の目安を確認し、
                        <br />
                        選んだ内容を相談へ引き継げます。
                    </p>
                </aside>
                <div className="estimate-panel">
                    <div className="estimate-progress">
                        <span>
                            {currentStep + 1} / {totalSteps}
                        </span>
                        <div>
                            <i style={{ width: `${progress}%` }} />
                        </div>
                        <button type="button" onClick={handleReset}>
                            最初から
                        </button>
                    </div>
                    {renderStepContent()}
                    <div className="estimate-actions">
                        <button type="button" className="text-link" onClick={handleBack} disabled={currentStep === 0}>
                            ← 戻る
                        </button>
                        <span />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
