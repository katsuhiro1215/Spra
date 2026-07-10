<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>領収書 - {{ $receipt->receipt_number }}</title>
    <style>
        @page {
            margin: 20mm;
        }

        body {
            font-family: "Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #059669;
        }

        .header h1 {
            font-size: 32pt;
            margin: 0 0 10px 0;
            color: #059669;
        }

        .receipt-info {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }

        .receipt-info-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .receipt-info-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }

        .recipient-info {
            border: 2px solid #059669;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
        }

        .recipient-info h3 {
            margin: 0 0 10px 0;
            font-size: 18pt;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 10px;
        }

        .receipt-meta {
            margin-bottom: 20px;
        }

        .receipt-meta table {
            width: 100%;
            border-collapse: collapse;
        }

        .receipt-meta td {
            padding: 8px;
            border: 1px solid #e5e7eb;
        }

        .receipt-meta td:first-child {
            background: #f9fafb;
            font-weight: bold;
            width: 40%;
        }

        .total-amount {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: #d1fae5;
            border: 3px solid #059669;
            border-radius: 10px;
        }

        .total-amount p {
            margin: 0 0 15px 0;
            font-size: 16pt;
            font-weight: bold;
        }

        .total-amount .amount {
            font-size: 40pt;
            font-weight: bold;
            color: #059669;
            border-bottom: 2px solid #059669;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }

        .purpose {
            margin: 40px 0;
            padding: 20px;
            background: #f3f4f6;
            border-left: 4px solid #059669;
        }

        .purpose h4 {
            margin: 0 0 10px 0;
            color: #065f46;
        }

        .breakdown-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }

        .breakdown-table th {
            background: #059669;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        .breakdown-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }

        .breakdown-table .text-right {
            text-align: right;
        }

        .breakdown-table .total-row {
            background: #d1fae5;
            font-weight: bold;
            font-size: 14pt;
        }

        .issuer-info {
            margin-top: 50px;
            padding: 20px;
            background: #f9fafb;
            border: 1px solid #d1d5db;
            border-radius: 5px;
        }

        .issuer-info h4 {
            margin: 0 0 15px 0;
            color: #059669;
            border-bottom: 2px solid #059669;
            padding-bottom: 10px;
        }

        .stamp-area {
            position: absolute;
            right: 50px;
            top: 200px;
            width: 100px;
            height: 100px;
            border: 2px solid #dc2626;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
        }

        .stamp-area p {
            margin: 0;
            font-size: 10pt;
            color: #dc2626;
            font-weight: bold;
            text-align: center;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 10pt;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="stamp-area">
        <p>領<br>収<br>済</p>
    </div>

    <div class="header">
        <h1>領収書</h1>
        <p>Receipt</p>
    </div>

    <div class="recipient-info">
        <h3>{{ $receipt->user->name }} 様</h3>
        @if ($receipt->company)
            <p>{{ $receipt->company->name }}</p>
            @if ($receipt->company->address)
                <p>{{ $receipt->company->address }}</p>
            @endif
        @endif
    </div>

    <div class="total-amount">
        <p>但し、下記の金額を正に領収いたしました</p>
        <div class="amount">¥{{ number_format($receipt->total_amount) }}</div>
        <p style="font-size: 12pt; color: #065f46;">（税込）</p>
    </div>

    <div class="purpose">
        <h4>但書</h4>
        <p>{{ $receipt->invoice->title }}</p>
    </div>

    <h3 style="margin: 30px 0 15px 0; color: #059669;">内訳</h3>
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
                <td>消費税（{{ $receipt->invoice->tax_rate }}%）</td>
                <td class="text-right">¥{{ number_format($receipt->tax_amount) }}</td>
            </tr>
            <tr class="total-row">
                <td>合計金額（税込）</td>
                <td class="text-right">¥{{ number_format($receipt->total_amount) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="issuer-info">
        <h4>発行者情報</h4>
        <table style="width: 100%;">
            <tr>
                <td style="width: 30%; font-weight: bold;">領収書番号</td>
                <td>{{ $receipt->receipt_number }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">発行日</td>
                <td>{{ $receipt->issued_at->format('Y年m月d日') }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">発行者</td>
                <td>{{ config('app.name') }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">所在地</td>
                <td>〒000-0000 東京都○○区△△ 1-2-3</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">連絡先</td>
                <td>Tel: 03-0000-0000 / Email: info@example.com</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>
            この領収書は、ご入金確認後に発行されたものです。<br>
            再発行はできませんので、大切に保管してください。
        </p>
    </div>
</body>

</html>
