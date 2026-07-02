<?php

namespace App\Observers;

use App\Models\Quote;
use App\Models\User;

class QuoteObserver
{
  /**
   * Quote が作成されるとき、メールアドレスからユーザーと会社を自動特定する
   */
  public function creating(Quote $quote): void
  {
    // 既に user_id と company_id が設定されている場合はスキップ
    if ($quote->user_id && $quote->company_id) {
      return;
    }

    // Contact 情報からメールアドレスを取得
    if ($quote->contact_id && !$quote->user_id) {
      $contact = $quote->contact;

      if ($contact && $contact->email) {
        // メールアドレスからユーザーを検索
        $user = User::where('email', $contact->email)->first();

        if ($user) {
          $quote->user_id = $user->id;

          // ユーザーが会社を持っている場合、最初の会社を紐付ける
          if ($user->companies()->count() > 0 && !$quote->company_id) {
            $quote->company_id = $user->companies()->first()->id;
          }
        }
      }
    }
  }

  /**
   * Quote が更新されるとき、同じロジックを適用
   */
  public function updating(Quote $quote): void
  {
    // contact_id が変更された場合、ユーザー情報も更新する
    if ($quote->isDirty('contact_id') && !$quote->user_id) {
      $contact = $quote->contact;

      if ($contact && $contact->email) {
        $user = User::where('email', $contact->email)->first();

        if ($user) {
          $quote->user_id = $user->id;

          if ($user->companies()->count() > 0 && !$quote->company_id) {
            $quote->company_id = $user->companies()->first()->id;
          }
        }
      }
    }
  }
}
