<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>請求書 - {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 15mm 15mm 20mm 15mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, メイリオ, sans-serif;
            font-size: 10pt;
            line-height: 1.6;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }

        /* ヘッダー */
        .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 24pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }

        .header-info {
            display: table;
            width: 100%;
            margin-top: 10px;
        }

        .header-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .header-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }

        /* クライアント情報 */
        .client-info {
            margin-bottom: 20px;
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
        }

        .client-info h2 {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }

        .client-info p {
            margin: 5px 0;
        }

        /* 請求情報 */
        .invoice-meta {
            margin-bottom: 20px;
        }

        .invoice-meta table {
            width: 100%;
            border-collapse: collapse;
        }

        .invoice-meta td {
            padding: 5px;
            border: 1px solid #ddd;
        }

        .invoice-meta td:first-child {
            width: 30%;
            background-color: #f0f0f0;
            font-weight: bold;
        }

        /* 金額サマリー */
        .amount-summary {
            float: right;
            width: 50%;
            margin-top: 10px;
        }

        .amount-summary table {
            width: 100%;
            border-collapse: collapse;
        }

        .amount-summary td {
            padding: 8px;
            border: 1px solid #ddd;
        }

        .amount-summary td:first-child {
            width: 60%;
            background-color: #f0f0f0;
            font-weight: bold;
        }

        .amount-summary td:last-child {
            text-align: right;
        }

        .amount-summary .total-row {
            background-color: #333;
            color: white;
            font-weight: bold;
            font-size: 11pt;
        }

        /* 支払い情報 */
        .payment-info {
            clear: both;
            margin-top: 30px;
            padding: 15px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
        }

        .payment-info h3 {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .payment-info table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
        }

        .payment-info td {
            padding: 5px;
            border: 1px solid #ddd;
        }

        .payment-info td:first-child {
            width: 30%;
            background-color: #f0f0f0;
            font-weight: bold;
        }

        /* 備考 */
        .notes {
            clear: both;
            margin-top: 30px;
            padding: 15px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
        }

        .notes h3 {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .notes p {
            white-space: pre-wrap;
            line-height: 1.8;
            font-size: 9pt;
        }

        /* フッター */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 9pt;
            color: #666;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- ヘッダー -->
        <div class="header">
            <h1>請求書</h1>
            @if ($invoice->contract || $invoice->billing_period_label)
                <p style="font-size: 11pt; color: #333; margin: -10px 0 15px 0;">
                    {{ $invoice->contract->title ?? '' }}{{ $invoice->contract && $invoice->billing_period_label ? '　' : '' }}{{ $invoice->billing_period_label ? '（' . $invoice->billing_period_label . '）' : '' }}
                </p>
            @endif
            <div class="header-info">
                <div class="header-left">
                    <p><strong>{{ $invoice->company->name ?? 'Company Name' }}</strong></p>
                    @if ($invoice->company && $invoice->company->addresses->count() > 0)
                        <p style="font-size: 9pt; color: #666;">
                            {{ $invoice->company->addresses->first()->formatted_address ?? '' }}
                        </p>
                    @endif
                </div>
                <div class="header-right">
                    <p><strong>請求書番号:</strong> {{ $invoice->invoice_number }}</p>
                    <p><strong>発行日:</strong>
                        {{ $invoice->issue_date ? \Carbon\Carbon::parse($invoice->issue_date)->format('Y年m月d日') : '-' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- クライアント情報 -->
        @if ($invoice->user)
            <div class="client-info">
                <h2>ご請求先</h2>
                <p><strong>{{ $invoice->user->profile->full_name ?? $invoice->user->email }}</strong></p>
                <p>{{ $invoice->user->profile->company_name ?? '' }}</p>
            </div>
        @endif

        <!-- 請求情報 -->
        <div class="invoice-meta">
            <table>
                <tr>
                    <td>支払期限</td>
                    <td>{{ $invoice->due_date ? \Carbon\Carbon::parse($invoice->due_date)->format('Y年m月d日') : '-' }}
                    </td>
                </tr>
                <tr>
                    <td>請求状態</td>
                    <td>{{ $status_label ?? $invoice->status }}</td>
                </tr>
                @if ($invoice->invoice_type)
                    <tr>
                        <td>請求区分</td>
                        <td>{{ $invoice->invoice_type_name }}</td>
                    </tr>
                @endif
            </table>
        </div>

        <!-- 明細 -->
        @if ($invoice->items && $invoice->items->count() > 0)
            <h3 style="margin: 30px 0 15px 0; color: #2563eb;">明細</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr>
                        <td style="padding:5px; border:1px solid #ddd; background-color:#f0f0f0; font-weight:bold;">項目</td>
                        <td style="padding:5px; border:1px solid #ddd; background-color:#f0f0f0; font-weight:bold; width:15%; text-align:right;">数量</td>
                        <td style="padding:5px; border:1px solid #ddd; background-color:#f0f0f0; font-weight:bold; width:20%; text-align:right;">単価</td>
                        <td style="padding:5px; border:1px solid #ddd; background-color:#f0f0f0; font-weight:bold; width:20%; text-align:right;">金額</td>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($invoice->items as $item)
                        <tr>
                            <td style="padding:5px; border:1px solid #ddd;">{{ $item->description }}</td>
                            <td style="padding:5px; border:1px solid #ddd; text-align:right;">{{ number_format((float) $item->quantity, 2) }}</td>
                            <td style="padding:5px; border:1px solid #ddd; text-align:right;">¥{{ number_format($item->unit_price) }}</td>
                            <td style="padding:5px; border:1px solid #ddd; text-align:right;">¥{{ number_format($item->amount) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <!-- 請求内容 -->
        <h3 style="margin: 30px 0 15px 0; color: #2563eb;">ご請求内容</h3>
        @if ($invoice->billing_period_start || $invoice->billing_period_end)
            <p style="text-align: center; margin-bottom: 20px; color: #666;">
                請求期間:
                @if ($invoice->billing_period_start)
                    {{ \Carbon\Carbon::parse($invoice->billing_period_start)->format('Y年m月d日') }}
                @endif
                @if ($invoice->billing_period_end)
                    ～ {{ \Carbon\Carbon::parse($invoice->billing_period_end)->format('Y年m月d日') }}
                @endif
            </p>
        @endif

        <!-- 金額サマリー -->
        <div class="amount-summary">
            <table>
                <tr>
                    <td>小計（税抜き）</td>
                    <td>¥{{ number_format($invoice->subtotal) }}</td>
                </tr>
                <tr>
                    <td>消費税（{{ number_format((float) $invoice->tax_rate, 1) }}%）</td>
                    <td>¥{{ number_format($invoice->tax_amount) }}</td>
                </tr>
                <tr class="total-row">
                    <td>合計金額</td>
                    <td>¥{{ number_format($invoice->total_amount) }}</td>
                </tr>
            </table>
        </div>

        <!-- 支払い情報 -->
        @if ($invoice->contract && $invoice->contract->currentVersion)
            <div class="payment-info">
                <h3>契約情報</h3>
                <table>
                    <tr>
                        <td>契約番号</td>
                        <td>{{ $invoice->contract->contract_number }}</td>
                    </tr>
                    <tr>
                        <td>契約名</td>
                        <td>{{ $invoice->contract->title }}</td>
                    </tr>
                    <tr>
                        <td>契約金額（総額）</td>
                        <td>¥{{ number_format($invoice->contract->currentVersion->total_amount) }}</td>
                    </tr>
                    @if ($invoice->invoice_type && $invoice->invoice_type !== 'full')
                        <tr>
                            <td>今回のご請求</td>
                            <td>{{ $invoice->invoice_type_name }} ¥{{ number_format($invoice->total_amount) }}</td>
                        </tr>
                    @endif
                </table>
            </div>
        @endif

        <!-- 備考 -->
        @if ($invoice->notes)
            <div class="notes">
                <h3>備考</h3>
                <p>{{ $invoice->notes }}</p>
            </div>
        @endif

        <!-- フッター -->
        <div class="footer">
            <p>このドキュメントは自動生成されました。</p>
            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>
    </div>
</body>

</html>
