<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\SiteSettingRequest;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    /**
     * プリセット設定のフィールド定義（groupはフォーム内のセクション分けに利用）
     */
    private const GROUP_FIELDS = [
        'general' => [
            'label' => '一般',
            'fields' => [
                'site_name' => ['type' => 'string', 'label' => 'サイト名'],
                'site_description' => ['type' => 'string', 'label' => 'サイト説明'],
                'contact_email' => ['type' => 'string', 'label' => '問い合わせメールアドレス'],
                'contact_phone' => ['type' => 'string', 'label' => '電話番号'],
                'copyright_text' => ['type' => 'string', 'label' => 'コピーライト表記'],
            ],
        ],
        'navigation' => [
            'label' => 'ナビゲーション',
            'fields' => [
                'nav_logo_text' => ['type' => 'string', 'label' => 'ロゴテキスト'],
                'nav_cta_label' => ['type' => 'string', 'label' => 'CTAボタン文言'],
                'nav_cta_url' => ['type' => 'string', 'label' => 'CTAボタンリンク先'],
            ],
        ],
        'footer' => [
            'label' => 'フッター',
            'fields' => [
                'footer_text' => ['type' => 'string', 'label' => 'フッターテキスト'],
                'footer_social_facebook' => ['type' => 'string', 'label' => 'Facebook URL'],
                'footer_social_twitter' => ['type' => 'string', 'label' => 'X (Twitter) URL'],
                'footer_social_instagram' => ['type' => 'string', 'label' => 'Instagram URL'],
            ],
        ],
        'seo' => [
            'label' => 'SEO',
            'fields' => [
                'seo_default_title' => ['type' => 'string', 'label' => 'デフォルトタイトル'],
                'seo_default_description' => ['type' => 'string', 'label' => 'デフォルト説明文'],
                'seo_default_keywords' => ['type' => 'string', 'label' => 'デフォルトキーワード'],
                'seo_google_analytics_id' => ['type' => 'string', 'label' => 'Google Analytics ID'],
            ],
        ],
        'ogp' => [
            'label' => 'OGP',
            'fields' => [
                'ogp_title' => ['type' => 'string', 'label' => 'OGPタイトル'],
                'ogp_description' => ['type' => 'string', 'label' => 'OGP説明文'],
                'ogp_image' => ['type' => 'string', 'label' => 'OGP画像URL'],
                'ogp_type' => ['type' => 'string', 'label' => 'OGPタイプ'],
            ],
        ],
    ];

    /**
     * 設定一覧（プリセット設定への導線 + 個別設定一覧）
     */
    public function index(): Response
    {
        $settings = SiteSetting::orderBy('group')->orderBy('key')->get();
        $presetKeys = collect(self::GROUP_FIELDS)->flatMap(fn ($group) => array_keys($group['fields']));

        return Inertia::render('Admin/Website/SiteSetting/Index', [
            'customSettings' => $settings->whereNotIn('key', $presetKeys)->values(),
        ]);
    }

    /**
     * プリセット設定の表示・保存（全グループを1画面にまとめて管理）
     */
    public function settings(Request $request): Response|RedirectResponse
    {
        if ($request->isMethod('post')) {
            $rules = [];
            foreach (self::GROUP_FIELDS as $group) {
                foreach ($group['fields'] as $key => $meta) {
                    $rules[$key] = ['nullable', 'string', 'max:2000'];
                }
            }
            $validated = $request->validate($rules);

            foreach (self::GROUP_FIELDS as $groupKey => $group) {
                foreach ($group['fields'] as $key => $meta) {
                    SiteSetting::set(
                        $key,
                        $validated[$key] ?? null,
                        $meta['type'],
                        $groupKey,
                        $meta['label']
                    );
                }
            }

            return redirect()->back()->with('success', '設定を保存しました。');
        }

        $values = [];
        foreach (array_keys(self::GROUP_FIELDS) as $groupKey) {
            $values += SiteSetting::getByGroup($groupKey)->toArray();
        }

        return Inertia::render('Admin/Website/SiteSetting/Settings', [
            'groups' => self::GROUP_FIELDS,
            'values' => $values,
        ]);
    }

    /**
     * 個別設定の作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Website/SiteSetting/Create');
    }

    /**
     * 個別設定を保存
     */
    public function store(SiteSettingRequest $request): RedirectResponse
    {
        SiteSetting::create($request->validated());

        return redirect()->route('admin.website.siteSetting.index')
            ->with('success', '設定を作成しました。');
    }

    /**
     * 個別設定の詳細
     */
    public function show(SiteSetting $siteSetting): Response
    {
        return Inertia::render('Admin/Website/SiteSetting/Show', [
            'setting' => $siteSetting,
        ]);
    }

    /**
     * 個別設定の編集フォーム
     */
    public function edit(SiteSetting $siteSetting): Response
    {
        return Inertia::render('Admin/Website/SiteSetting/Edit', [
            'setting' => $siteSetting,
        ]);
    }

    /**
     * 個別設定を更新
     */
    public function update(SiteSettingRequest $request, SiteSetting $siteSetting): RedirectResponse
    {
        $siteSetting->update($request->validated());

        return redirect()->route('admin.website.siteSetting.index')
            ->with('success', '設定を更新しました。');
    }

    /**
     * 個別設定を削除
     */
    public function destroy(SiteSetting $siteSetting): RedirectResponse
    {
        $siteSetting->delete();

        return redirect()->route('admin.website.siteSetting.index')
            ->with('success', '設定を削除しました。');
    }
}
