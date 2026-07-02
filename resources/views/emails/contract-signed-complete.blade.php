{{ $user->name }}さん

いつもお世話になっております。

契約書「{{ $contract->title }}」が完全に署名されました。

契約内容：
- 契約ID: {{ $contract->id }}
- 契約金額: ¥{{ number_format($contract->total_amount) }}
- 契約期間: {{ \Carbon\Carbon::parse($contract->start_date)->format('Y年m月d日') }} ～
{{ \Carbon\Carbon::parse($contract->end_date)->format('Y年m月d日') }}

ご確認よろしくお願いいたします。

{{ config('app.name') }}
