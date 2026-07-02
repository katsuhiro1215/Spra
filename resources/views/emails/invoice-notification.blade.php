{{ $user->name }}さん

いつもお世話になっております。

契約「{{ $contract->title }}」の請求書をお送りいたします。

【請求書情報】
請求書番号: {{ $invoice->invoice_number }}
発行日: {{ $invoice->issue_date->format('Y年m月d日') }}
請求期間: {{ $invoice->billing_period_start->format('Y年m月d日') }} ～ {{ $invoice->billing_period_end->format('Y年m月d日') }}

【請求金額】
小計: ¥{{ number_format($invoice->subtotal) }}
税率: {{ $invoice->tax_rate }}%
税額: ¥{{ number_format($invoice->tax_amount) }}
─────────────────
合計: ¥{{ number_format($invoice->total_amount) }}

【お支払い期限】
{{ $invoice->due_date->format('Y年m月d日') }}

ご不明な点やご質問がございましたら、お気軽にお問い合わせください。

{{ config('app.name') }}
