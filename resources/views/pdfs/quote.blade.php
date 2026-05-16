<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>見積書 - {{ $quote->quote_number }}</title>
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

        /* 見積情報 */
        .quote-meta {
            margin-bottom: 20px;
        }

        .quote-meta table {
            width: 100%;
            border-collapse: collapse;
        }

        .quote-meta td {
            padding: 5px;
            border: 1px solid #ddd;
        }

        .quote-meta td:first-child {
            width: 30%;
            background-color: #f0f0f0;
            font-weight: bold;
        }

        /* 見積明細 */
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

        /* 備考・要件 */
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

        /* フッター */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 9pt;
            color: #666;
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
    </style>
</head>

<body>
    <div class="container">
        <!-- ヘッダー -->
        <div class="header">
            <h1>御見積書</h1>
            <div class="header-info">
                <div class="header-left">
                    <p><strong>見積番号:</strong> {{ $quote->quote_number }}</p>
                    <p><strong>発行日:</strong> {{ $quote->created_at->format('Y年m月d日') }}</p>
                    @if ($quote->expires_at)
                        <p><strong>有効期限:</strong> {{ \Carbon\Carbon::parse($quote->expires_at)->format('Y年m月d日') }}</p>
                    @endif
                </div>
                <div class="header-right">
                    <p><strong>{{ config('app.name') }}</strong></p>
                    @if ($quote->creator)
                        <p>担当者: {{ $quote->creator->profile->full_name ?? $quote->creator->email }}</p>
                    @endif
                </div>
            </div>
        </div>

        <!-- クライアント情報 -->
        <div class="client-info">
            <h2>お客様情報</h2>
            @if ($quote->client_company)
                <p><strong>会社名:</strong> {{ $quote->client_company }}</p>
            @endif
            <p><strong>お名前:</strong> {{ $quote->client_name }} 様</p>
            @if ($quote->client_address)
                <p><strong>住所:</strong> {{ $quote->client_address }}</p>
            @endif
            <p><strong>メールアドレス:</strong> {{ $quote->client_email }}</p>
            @if ($quote->client_phone)
                <p><strong>電話番号:</strong> {{ $quote->client_phone }}</p>
            @endif
        </div>

        <!-- 件名 -->
        @if ($quote->title)
            <div style="margin-bottom: 20px;">
                <p><strong>件名:</strong> {{ $quote->title }}</p>
            </div>
        @endif

        <!-- 見積明細 -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">No.</th>
                    <th style="width: 40%;">品目・サービス名</th>
                    <th style="width: 15%;">課金形態</th>
                    <th style="width: 10%;" class="text-center">数量</th>
                    <th style="width: 15%;" class="text-right">単価</th>
                    <th style="width: 15%;" class="text-right">金額</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($quote->items as $index => $item)
                    <tr>
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td>
                            <strong>{{ $item->name }}</strong>
                            @if ($item->description)
                                <br><small style="color: #666;">{{ $item->description }}</small>
                            @endif
                        </td>
                        <td>
                            @switch($item->billing_type)
                                @case('one_time')
                                    一括
                                @break

                                @case('monthly')
                                    月額
                                @break

                                @case('quarterly')
                                    四半期
                                @break

                                @case('yearly')
                                    年額
                                @break

                                @default
                                    {{ $item->billing_type }}
                            @endswitch
                        </td>
                        <td class="text-center">{{ number_format($item->quantity) }}</td>
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
                    <td>¥{{ number_format($quote->base_amount) }}</td>
                </tr>
                @if ($quote->discount_amount > 0)
                    <tr>
                        <td>値引き</td>
                        <td>-¥{{ number_format($quote->discount_amount) }}</td>
                    </tr>
                @endif
                <tr>
                    <td>消費税 ({{ $quote->tax_rate * 100 }}%)</td>
                    <td>¥{{ number_format($quote->tax_amount) }}</td>
                </tr>
                <tr class="total-row">
                    <td>合計金額</td>
                    <td>¥{{ number_format($quote->total_amount) }}</td>
                </tr>
            </table>
        </div>

        <!-- 要件・備考 -->
        @if ($quote->requirements)
            <div class="notes">
                <h3>要件・仕様</h3>
                <p>{{ $quote->requirements }}</p>
            </div>
        @endif

        @if ($quote->custom_specifications && count($quote->custom_specifications) > 0)
            <div class="notes">
                <h3>カスタム仕様</h3>
                <p>{{ json_encode($quote->custom_specifications, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) }}</p>
            </div>
        @endif

        <!-- 会社情報 -->
        <div class="company-info">
            <h3>{{ config('app.name') }}</h3>
            <p>〒XXX-XXXX 都道府県市区町村番地</p>
            <p>TEL: XXX-XXXX-XXXX</p>
            <p>Email: info@example.com</p>
            <p>Web: https://example.com</p>
        </div>

        <!-- フッター -->
        <div class="footer">
            <p>この見積書は {{ $quote->created_at->format('Y年m月d日') }} に発行されました。</p>
            @if ($quote->expires_at)
                <p>有効期限: {{ \Carbon\Carbon::parse($quote->expires_at)->format('Y年m月d日') }} まで</p>
            @endif
        </div>
    </div>
</body>

</html>
