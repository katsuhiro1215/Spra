<?php

namespace App\Repositories;

use App\Models\MediaSetting;

class MediaSettingsRepository
{
    /**
     * デフォルト設定を取得（Tenantなし）
     */
    public function get(): MediaSetting
    {
        // 最初の設定を取得、なければデフォルト値で新規作成
        $setting = MediaSetting::first();

        if (!$setting) {
            $setting = MediaSetting::create([
                'max_file_size_kb' => 10240, // 10MB
                'max_total_storage_mb' => 1024, // 1GB
                'auto_compress' => true,
                'compression_quality' => 85,
                'output_format' => 'webp',
                'large_width' => 1920,
                'large_height' => 1080,
                'medium_width' => 1024,
                'medium_height' => 768,
                'small_width' => 640,
                'small_height' => 480,
                'generate_large' => true,
                'generate_medium' => true,
                'generate_small' => true,
                'allow_video_upload' => true,
                'max_video_size_mb' => 100,
                'max_video_duration_seconds' => 300,
            ]);
        }

        return $setting;
    }

    /**
     * 更新
     */
    public function update(MediaSetting $settings, array $data): bool
    {
        return $settings->update($data);
    }
}
