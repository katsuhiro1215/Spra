@component('mail::message')
    # お支払いのお願い

    {{ $invoice->user->name }} 様

    いつも大変お世話になっております。{{ config('app.name') }}です。

    {{ $invoice->issue_date->format('Y年m月') }}分のご請求につきまして、お支払い期限が過ぎております。
    ご確認の上、お早めにお支払いくださいますようお願い申し上げます。

    ---

    **請求書番号**
    {{ $invoice->invoice_number }}

    **発行日**
    {{ $invoice->issue_date->format('Y年m月d日') }}

    **お支払い期限**
    {{ $invoice->due_date->format('Y年m月d日') }}

    **ご請求内容**
    {{ $invoice->title }}

    **ご請求金額**
    ¥{{ number_format($invoice->total_amount) }}（税込）

    ---

    **お支払い方法**

    ご請求書に記載の銀行口座へお振込みください。
    お振込み手数料は恐れ入りますがご負担くださいますようお願いいたします。

    ---

    すでにお支払いいただいている場合は、本メールをご放念ください。

    ご不明な点がございましたら、お気軽にお問い合わせください。

    今後とも何卒よろしくお願い申し上げます。

    {{ config('app.name') }}
@endcomponent
