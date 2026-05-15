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

        .invoice-meta .due-date {
            color: #d9534f;
            font-weight: bold;
        }

        /* 請求明細 */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .items-table th {
            background-color: #333;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 9pt;
            border: 1px solid #333;
        }

        .items-table td {
            padding: 8px;
            border: 1px solid #ddd;
            font-size: 9pt;
        }

        .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .items-table .text-right {
            text-align: right;
        }

        .items-table .text-center {
            text-align: center;
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
            border: 2px solid #d9534f;
            background-color: #fff5f5;
        }

        .payment-info h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
            color: #d9534f;
        }

        .payment-info p {
            margin: 5px 0;
        }

        .payment-info table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
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
        }

        /* 会社情報 */
        .company-info {
            margin-top: 30px;
            padding: 15px;
            border: 2px solid #333;
            background-color: #f9f9f9;
        }

        .company-info h3 {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
        }

        .company-info p {
            margin: 3px 0;
            text-align: center;
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
    </style>
</head>

<body>
    <div class="container">
        <!-- ヘッダー -->
        <div class="header">
            <h1>御請求書</h1>
            <div class="header-info">
                <div class="header-left">
                    <p><strong>請求書番号:</strong> {{ $invoice->invoice_number }}</p>
                    <p><strong>発行日:</strong> {{ $invoice->created_at->format('Y年m月d日') }}</p>
                    @if ($invoice->due_date)
                        <p class="due-date"><strong>お支払期限:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('Y年m月d日') }}</p>
                    @endif
                </div>
                <div class="header-right">
                    <p><strong>{{ config('app.name') }}</strong></p>
                    @if ($invoice->created_by_admin)
                        <p>担当者: {{ $invoice->created_by_admin->profile->full_name ?? $invoice->created_by_admin->email }}</p>
                    @endif
                </div>
            </div>
        </div>

        <!-- クライアント情報 -->
        <div class="client-info">
            <h2>お客様情報</h2>
            @if ($invoice->company)
                <p><strong>会社名:</strong> {{ $invoice->company->name }}</p>
            @endif
            @if ($invoice->user)
                <p><strong>お名前:</strong> {{ $invoice->user->profile->full_name ?? $invoice->user->email }} 様</p>
                @if ($invoice->user->profile && $invoice->user->profile->address)
                    <p><strong>住所:</strong> {{ $invoice->user->profile->address }}</p>
                @endif
                <p><strong>メールアドレス:</strong> {{ $invoice->user->email }}</p>
                @if ($invoice->user->profile && $invoice->user->profile->phone)
                    <p><strong>電話番号:</strong> {{ $invoice->user->profile->phone }}</p>
                @endif
            @endif
        </div>

        <!-- 請求情報 -->
        <div class="invoice-meta">
            <table>
                @if ($invoice->contract)
                    <tr>
                        <td>契約</td>
                        <td>{{ $invoice->contract->contract_number }} - {{ $invoice->contract->title }}</td>
                    </tr>
                @endif
                @if ($invoice->title)
                    <tr>
                        <td>件名</td>
                        <td>{{ $invoice->title }}</td>
                    </tr>
                @endif
                @if ($invoice->billing_period_start && $invoice->billing_period_end)
                    <tr>
                        <td>請求期間</td>
                        <td>{{ \Carbon\Carbon::parse($invoice->billing_period_start)->format('Y年m月d日') }} ～ {{ \Carbon\Carbon::parse($invoice->billing_period_end)->format('Y年m月d日') }}</td>
                    </tr>
                @endif
            </table>
        </div>

        <!-- 請求明細 -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">No.</th>
                    <th style="width: 35%;">品目</th>
                    <th style="width: 30%;">説明</th>
                    <th style="width: 10%;" class="text-center">数量</th>
                    <th style="width: 10%;" class="text-right">単価</th>
                    <th style="width: 10%;" class="text-right">金額</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($invoice->items as $index => $item)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td><strong>{{ $item->name }}</strong></td>
                        <td><small style="color: #666;">{{ $item->description ?? '-' }}</small></td>
                        <td class="text-center">{{ number_format($item->quantity, 2) }}</td>
                        <td class="text-right">¥{{ number_format($item->unit_price) }}</td>
                        <td class="text-right">¥{{ number_format($item->amount) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- 金額サマリー -->
        <div class="amount-summary">
            <table>
                <tr>
                    <td>小計</td>
                    <td>¥{{ number_format($invoice->subtotal) }}</td>
                </tr>
                @if ($invoice->discount_amount > 0)
                    <tr>
                        <td>値引き</td>
                        <td style="color: #d9534f;">-¥{{ number_format($invoice->discount_amount) }}</td>
                    </tr>
                @endif
                <tr>
                    <td>消費税 ({{ number_format($invoice->tax_rate * 100, 1) }}%)</td>
                    <td>¥{{ number_format($invoice->tax_amount) }}</td>
                </tr>
                <tr class="total-row">
                    <td>合計金額</td>
                    <td>¥{{ number_format($invoice->total_amount) }}</td>
                </tr>
            </table>
        </div>

        <!-- 支払い情報 -->
        <div class="payment-info">
            <h3>お振込先</h3>
            <table>
                <tr>
                    <td>銀行名</td>
                    <td>○○銀行 ○○支店</td>
                </tr>
                <tr>
                    <td>口座種別</td>
                    <td>普通</td>
                </tr>
                <tr>
                    <td>口座番号</td>
                    <td>1234567</td>
                </tr>
                <tr>
                    <td>口座名義</td>
                    <td>{{ config('app.name') }}</td>
                </tr>
            </table>
            <p style="margin-top: 10px; color: #d9534f; font-weight: bold;">
                ※ お振込手数料はお客様のご負担にてお願いいたします。
            </p>
        </div>

        <!-- 備考 -->
        @if ($invoice->notes)
            <div class="notes">
                <h3>備考</h3>
                <p>{{ $invoice->notes }}</p>
            </div>
        @endif

        <!-- 会社情報 -->
        <div class="company-info">
            <h3>{{ config('app.name') }}</h3>
            <p>〒000-0000 東京都○○区○○ 1-2-3</p>
            <p>TEL: 03-0000-0000 / FAX: 03-0000-0001</p>
            <p>Email: info@example.com</p>
            <p>https://example.com</p>
        </div>

        <!-- フッター -->
        <div class="footer">
            <p>本請求書は、お支払い完了後も大切に保管ください。</p>
            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        </div>
    </div>
</body>

</html>
