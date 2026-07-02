{{ $user->name }}さん

いつもお世話になっております。

ご送付いただきました契約書「{{ $contract->title }}」のご署名をお願いいたします。

契約内容：
- 契約番号: {{ $contract->contract_number ?? $contract->id }}
- 契約金額: ¥{{ number_format($contract->amount) }}
- 契約期間: {{ \Carbon\Carbon::parse($contract->start_date)->format('Y年m月d日') }} ～
{{ \Carbon\Carbon::parse($contract->end_date)->format('Y年m月d日') }}

まだご署名いただいていない場合は、恐れ入りますがお早めにご対応をお願いいたします。

ご質問等ございましたら、お気軽にお問い合わせください。

{{ config('app.name') }}
