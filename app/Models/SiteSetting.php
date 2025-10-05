<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description'
    ];

    protected $casts = [
        'value' => 'json'
    ];

    // 設定値を取得
    public static function get($key, $default = null)
    {
        return Cache::remember("site_setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    // 設定値を保存
    public static function set($key, $value, $type = 'text', $group = 'general', $description = null)
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
                'description' => $description
            ]
        );

        Cache::forget("site_setting_{$key}");
        return $setting;
    }

    // グループ別設定取得
    public static function getByGroup($group)
    {
        return Cache::remember("site_settings_group_{$group}", 3600, function () use ($group) {
            return static::where('group', $group)->pluck('value', 'key');
        });
    }

    // 全設定取得
    public static function getAll()
    {
        return Cache::remember('site_settings_all', 3600, function () {
            return static::all()->pluck('value', 'key');
        });
    }

    // キャッシュクリア
    public static function clearCache()
    {
        $keys = static::pluck('key');
        foreach ($keys as $key) {
            Cache::forget("site_setting_{$key}");
        }
        Cache::forget('site_settings_all');
        
        $groups = static::distinct()->pluck('group');
        foreach ($groups as $group) {
            Cache::forget("site_settings_group_{$group}");
        }
    }

    protected static function booted()
    {
        static::saved(function () {
            static::clearCache();
        });

        static::deleted(function () {
            static::clearCache();
        });
    }
}
