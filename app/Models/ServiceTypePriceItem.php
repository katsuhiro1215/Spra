<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceTypePriceItem extends Model
{
  use HasFactory;

  protected $fillable = [
    'service_type_id',
    'category',
    'name',
    'description',
    'price',
    'unit',
    'quantity',
    'total_price',
    'is_optional',
    'is_variable',
    'sort_order',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'total_price' => 'decimal:2',
    'is_optional' => 'boolean',
    'is_variable' => 'boolean',
  ];

  /**
   * サービスタイプとのリレーション
   */
  public function serviceType(): BelongsTo
  {
    return $this->belongsTo(ServiceType::class);
  }

  /**
   * 小計の自動計算
   */
  protected static function boot()
  {
    parent::boot();

    static::saving(function ($model) {
      $model->total_price = $model->price * $model->quantity;
    });
  }

  /**
   * カテゴリ別の定数定義
   */
  public const CATEGORIES = [
    'design' => 'デザイン',
    'coding' => 'コーディング',
    'infrastructure' => 'インフラ・環境構築',
    'content' => 'コンテンツ制作',
    'testing' => 'テスト・検証',
    'management' => 'プロジェクト管理',
    'maintenance' => '保守・サポート',
    'optional' => 'オプション機能',
  ];

  /**
   * カテゴリ名の取得
   */
  public function getCategoryNameAttribute(): string
  {
    return self::CATEGORIES[$this->category] ?? $this->category;
  }
}
