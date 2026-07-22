<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\MediaSettingsRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaSettingController extends Controller
{
    public function __construct(private MediaSettingsRepository $settingsRepository) {}

    /**
     * メディア設定編集画面（グローバル設定1件のみ）
     */
    public function edit(): Response
    {
        return Inertia::render('Admin/MediaSetting/Edit', [
            'settings' => $this->settingsRepository->get(),
        ]);
    }

    /**
     * メディア設定更新
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'max_file_size_kb' => ['required', 'integer', 'min:1'],
            'max_total_storage_mb' => ['required', 'integer', 'min:1'],
            'auto_compress' => ['boolean'],
            'compression_quality' => ['required', 'integer', 'min:1', 'max:100'],
            'output_format' => ['required', 'string', 'in:webp,jpg,png'],
            'large_width' => ['required', 'integer', 'min:1'],
            'large_height' => ['required', 'integer', 'min:1'],
            'medium_width' => ['required', 'integer', 'min:1'],
            'medium_height' => ['required', 'integer', 'min:1'],
            'small_width' => ['required', 'integer', 'min:1'],
            'small_height' => ['required', 'integer', 'min:1'],
            'generate_large' => ['boolean'],
            'generate_medium' => ['boolean'],
            'generate_small' => ['boolean'],
            // 動画アップロードは未実装のため設定画面から除外している（DBカラムは温存し、実装時に復活させる）
        ], [], [
            'max_file_size_kb' => '最大ファイルサイズ',
            'max_total_storage_mb' => '総容量制限',
            'compression_quality' => '圧縮品質',
            'output_format' => '出力フォーマット',
            'large_width' => 'Large幅',
            'large_height' => 'Large高さ',
            'medium_width' => 'Medium幅',
            'medium_height' => 'Medium高さ',
            'small_width' => 'Small幅',
            'small_height' => 'Small高さ',
        ]);

        $settings = $this->settingsRepository->get();
        $this->settingsRepository->update($settings, $validated);

        return redirect()
            ->route('admin.mediaSettings.edit')
            ->with('success', __('messages.updated', ['attribute' => 'メディア設定']));
    }
}
