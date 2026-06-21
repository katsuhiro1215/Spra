@component('mail::message')
    # 領収書のご送付

    {{ $receipt->user->name }} 様

    いつも大変お世話になっております。{{ config('app.name') }}です。

    ご入金を確認いたしましたので、領収書をお送りいたします。

    ---

    **領収書番号**
    {{ $receipt->receipt_number }}

    **発行日**
    {{ $receipt->issued_at->format('Y年m月d日') }}

    **お支払い内容**
    {{ $receipt->invoice->title }}

    **ご入金金額**
    ¥{{ number_format($receipt->total_amount) }}（税込）

    ---

    この度はご入金いただき、誠にありがとうございました。

    今後とも何卒よろしくお願い申し上げます。

    {{ config('app.name') }}
@endcomponent
