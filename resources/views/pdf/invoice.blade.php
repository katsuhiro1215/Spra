<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>請求書 - {{ $invoice->invoice_number }}</title>
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
            border-bottom: 3px solid #2563eb;
        }

        .header h1 {
            font-size: 28pt;
            margin: 0 0 10px 0;
            color: #2563eb;
        }

        .invoice-info {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }

        .invoice-info-left {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .invoice-info-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
            text-align: right;
        }

        .company-info {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .company-info h3 {
            margin: 0 0 10px 0;
            font-size: 16pt;
        }

        .invoice-meta {
            margin-bottom: 20px;
        }

        .invoice-meta table {
            width: 100%;
            border-collapse: collapse;
        }

        .invoice-meta td {
            padding: 8px;
            border: 1px solid #e5e7eb;
        }

        .invoice-meta td:first-child {
            background: #f9fafb;
            font-weight: bold;
            width: 40%;
        }

        .total-amount {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #eff6ff;
            border: 2px solid #2563eb;
            border-radius: 5px;
        }

        .total-amount p {
            margin: 0 0 10px 0;
            font-size: 14pt;
        }

        .total-amount .amount {
            font-size: 32pt;
            font-weight: bold;
            color: #2563eb;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }

        .items-table th {
            background: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }

        .items-table tr:last-child td {
            border-bottom: 2px solid #2563eb;
        }

        .items-table .text-right {
            text-align: right;
        }

        .summary-table {
            width: 50%;
            margin-left: auto;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .summary-table td {
            padding: 10px;
            border: 1px solid #e5e7eb;
        }

        .summary-table td:first-child {
            background: #f9fafb;
            font-weight: bold;
            width: 40%;
        }

        .summary-table .total-row {
            background: #eff6ff;
            font-size: 14pt;
            font-weight: bold;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 10pt;
            color: #6b7280;
        }

        .notes {
            margin-top: 30px;
            padding: 15px;
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
        }

        .notes h4 {
            margin: 0 0 10px 0;
            color: #92400e;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>請求書</h1>
        <p>Invoice</p>
    </div>

    <div class="invoice-info">
        <div class="invoice-info-left">
            <div class="company-info">
                <h3>{{ $invoice->user->name }} 様</h3>
                @if ($invoice->company)
                    <p>{{ $invoice->company->name }}</p>
                    @if ($invoice->company->address)
                        <p>{{ $invoice->company->address }}</p>
                    @endif
                @endif
                @if ($invoice->user->email)
                    <p>Email: {{ $invoice->user->email }}</p>
                @endif
            </div>
        </div>
        <div class="invoice-info-right">
            <div class="invoice-meta">
                <table>
                    <tr>
                        <td>請求書番号</td>
                        <td>{{ $invoice->invoice_number }}</td>
                    </tr>
                    <tr>
                        <td>発行日</td>
                        <td>{{ $invoice->issue_date->format('Y年m月d日') }}</td>
                    </tr>
                    <tr>
                        <td>お支払い期限</td>
                        <td>{{ $invoice->due_date->format('Y年m月d日') }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="total-amount">
        <p>ご請求金額</p>
        <div class="amount">¥{{ number_format($invoice->total_amount) }}</div>
        <p style="font-size: 10pt; color: #6b7280;">（税込）</p>
    </div>

    <h3 style="margin: 30px 0 15px 0; color: #2563eb;">ご請求明細</h3>
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 50%;">品目</th>
                <th style="width: 15%;" class="text-right">数量</th>
                <th style="width: 17.5%;" class="text-right">単価</th>
                <th style="width: 17.5%;" class="text-right">金額</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td class="text-right">{{ number_format($item->quantity) }}</td>
                    <td class="text-right">¥{{ number_format($item->unit_price) }}</td>
                    <td class="text-right">¥{{ number_format($item->amount) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="summary-table">
        <tr>
            <td>小計</td>
            <td class="text-right">¥{{ number_format($invoice->subtotal) }}</td>
        </tr>
        <tr>
            <td>消費税（{{ $invoice->tax_rate }}%）</td>
            <td class="text-right">¥{{ number_format($invoice->tax_amount) }}</td>
        </tr>
        <tr class="total-row">
            <td>合計金額</td>
            <td class="text-right">¥{{ number_format($invoice->total_amount) }}</td>
        </tr>
    </table>

    <div class="notes">
        <h4>お支払い方法</h4>
        <p>下記の口座へお振込みください。お振込み手数料は恐れ入りますがご負担くださいますようお願いいたします。</p>
        <p style="margin-top: 10px;">
            <strong>銀行名:</strong> ○○銀行<br>
            <strong>支店名:</strong> △△支店<br>
            <strong>口座種別:</strong> 普通<br>
            <strong>口座番号:</strong> 1234567<br>
            <strong>口座名義:</strong> {{ config('app.name') }}
        </p>
    </div>

    <div class="footer">
        <p style="text-align: center;">
            <strong>{{ config('app.name') }}</strong><br>
            〒000-0000 東京都○○区△△ 1-2-3<br>
            Tel: 03-0000-0000 / Email: info@example.com
        </p>
    </div>
</body>

</html>
