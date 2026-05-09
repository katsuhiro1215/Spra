<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasUlid
{
  /**
   * ULIDを主キーとして使用する設定
   */
  public function initializeHasUlid(): void
  {
    $this->incrementing = false;
    $this->keyType = 'string';
  }

  /**
   * モデル作成時にULIDを自動生成
   */
  protected static function bootHasUlid(): void
  {
    static::creating(function ($model) {
      if (empty($model->{$model->getKeyName()})) {
        $model->{$model->getKeyName()} = (string) Str::ulid();
      }
    });
  }
}
