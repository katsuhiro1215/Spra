<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>領収書（まとめて出力）</title>
    <style>
        @page {
            margin: 18mm 20mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans JP', "Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
            font-size: 10.5pt;
            line-height: 1.5;
            color: #1f2937;
        }

        .receipt-page {
            page-break-after: always;
        }

        .receipt-page:last-child {
            page-break-after: auto;
        }

        .header {
            display: table;
            width: 100%;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1.5px solid #111827;
        }

        .header-title {
            display: table-cell;
            vertical-align: bottom;
        }

        .header-title h1 {
            font-size: 22pt;
            letter-spacing: 4px;
            margin: 0;
            color: #111827;
        }

        .header-meta {
            display: table-cell;
            vertical-align: bottom;
            text-align: right;
            font-size: 9.5pt;
            color: #4b5563;
        }

        .header-meta .receipt-number {
            font-size: 11pt;
            font-weight: bold;
            color: #111827;
        }

        .recipient {
            margin: 18px 0 22px 0;
        }

        .recipient .name {
            font-size: 15pt;
            font-weight: bold;
            border-bottom: 1px solid #9ca3af;
            display: inline-block;
            padding-bottom: 4px;
            min-width: 240px;
        }

        .recipient .company {
            margin-top: 6px;
            font-size: 10pt;
            color: #4b5563;
        }

        .total-amount {
            margin: 20px 0;
            padding: 16px 20px;
            border: 1.5px solid #111827;
        }

        .total-amount .label {
            font-size: 9.5pt;
            color: #4b5563;
            margin-bottom: 4px;
        }

        .total-amount .amount {
            font-size: 26pt;
            font-weight: bold;
            color: #111827;
        }

        .total-amount .amount .tax-note {
            font-size: 10pt;
            font-weight: normal;
            color: #4b5563;
            margin-left: 6px;
        }

        .purpose {
            margin: 14px 0 22px 0;
            font-size: 10pt;
            color: #374151;
        }

        .purpose span {
            font-weight: bold;
            color: #111827;
        }

        .breakdown-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0 0 22px 0;
            font-size: 10pt;
        }

        .breakdown-table th {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 8px 10px;
            text-align: left;
            font-weight: bold;
            color: #111827;
        }

        .breakdown-table td {
            padding: 8px 10px;
            border: 1px solid #e5e7eb;
        }

        .breakdown-table .text-right {
            text-align: right;
        }

        .breakdown-table .total-row td {
            font-weight: bold;
            border-top: 1.5px solid #111827;
        }

        .issuer-info {
            margin-top: 30px;
            padding-top: 14px;
            border-top: 1px solid #d1d5db;
            font-size: 9.5pt;
            color: #374151;
        }

        .issuer-info table {
            width: 100%;
        }

        .issuer-info td {
            padding: 2px 0;
            vertical-align: top;
        }

        .issuer-info td.label {
            width: 18%;
            color: #6b7280;
        }

        .footer {
            margin-top: 26px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
            font-size: 8.5pt;
            color: #9ca3af;
        }
    </style>
</head>

<body>
    @foreach ($receipts as $receipt)
        <div class="receipt-page">
            <div class="header">
                <div class="header-title">
                    <h1>領収書</h1>
                </div>
                <div class="header-meta">
                    <p class="receipt-number">No. {{ $receipt->receipt_number }}</p>
                    <p>発行日：{{ $receipt->issued_at->format('Y年m月d日') }}</p>
                </div>
            </div>

            <div class="recipient">
                <div class="name">{{ $receipt->user->profile?->full_name ?? $receipt->user->email }} 様</div>
                @if ($receipt->company)
                    <p class="company">
                        {{ $receipt->company->name }}
                        @if ($receipt->company->address)
                            ／{{ $receipt->company->address }}
                        @endif
                    </p>
                @endif
            </div>

            <div class="total-amount">
                <p class="label">但し、下記の金額を正に領収いたしました</p>
                <div class="amount">
                    ¥{{ number_format($receipt->total_amount) }}<span class="tax-note">（税込）</span>
                </div>
            </div>

            <p class="purpose">
                <span>但書：</span>
                {{ $receipt->invoice?->contract?->title ?? $receipt->invoice?->invoice_number }}
                {{ $receipt->invoice?->invoice_type_name }}として
            </p>

            <table class="breakdown-table">
                <thead>
                    <tr>
                        <th style="width: 60%;">項目</th>
                        <th style="width: 40%;" class="text-right">金額</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>小計（税抜）</td>
                        <td class="text-right">¥{{ number_format($receipt->amount) }}</td>
                    </tr>
                    <tr>
                        <td>消費税（{{ number_format((float) $receipt->invoice?->tax_rate, 1) }}%）</td>
                        <td class="text-right">¥{{ number_format($receipt->tax_amount) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td>合計金額（税込）</td>
                        <td class="text-right">¥{{ number_format($receipt->total_amount) }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="issuer-info">
                <table>
                    <tr>
                        <td class="label">発行者</td>
                        <td>{{ config('app.name') }}</td>
                    </tr>
                    <tr>
                        <td class="label">所在地</td>
                        <td>〒000-0000 東京都○○区△△ 1-2-3</td>
                    </tr>
                    <tr>
                        <td class="label">連絡先</td>
                        <td>Tel: 03-0000-0000 / Email: info@example.com</td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                <p>
                    この領収書はご入金確認後に発行されたものです。再発行はできませんので、大切に保管してください。
                </p>
            </div>
        </div>
    @endforeach
</body>

</html>
