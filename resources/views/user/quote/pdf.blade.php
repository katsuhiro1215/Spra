<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>見積書</title>
    <style>
        body {
            font-family: 'Noto Sans JP', "DejaVu Sans", sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
        }

        .quote-title {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
        }

        .quote-info {
            margin-bottom: 30px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .info-label {
            font-weight: bold;
            width: 150px;
        }

        .info-value {
            flex: 1;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .table th {
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }

        .table td {
            border: 1px solid #ddd;
            padding: 10px;
        }

        .table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .amount-table {
            width: 100%;
            margin-top: 20px;
            margin-bottom: 30px;
        }

        .amount-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
        }

        .amount-label {
            width: 200px;
            text-align: right;
            font-weight: bold;
            margin-right: 20px;
        }

        .amount-value {
            width: 150px;
            text-align: right;
            font-weight: bold;
        }

        .total-row {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #333;
        }

        .total-label {
            width: 200px;
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            margin-right: 20px;
        }

        .total-value {
            width: 150px;
            text-align: right;
            font-size: 20px;
            font-weight: bold;
            color: #d32f2f;
        }

        .description {
            margin-top: 30px;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
        }

        .note {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
            line-height: 1.6;
        }

        .right-align {
            text-align: right;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- ヘッダー -->
        <div class="header">
            <div class="company-name">{{ config('app.name') }}</div>
        </div>

        <!-- タイトル -->
        <div class="quote-title" style="margin-bottom: 40px;">見積書</div>

        <!-- 基本情報 -->
        <div class="quote-info">
            <div class="info-row">
                <span class="info-label">見積書番号：</span>
                <span class="info-value">{{ $quote->quote_number }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">件名：</span>
                <span class="info-value">{{ $quote->title }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">発行日：</span>
                <span class="info-value">{{ $quote->created_at->format('Y年m月d日') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">有効期限：</span>
                <span class="info-value">{{ $quote->expiry_date?->format('Y年m月d日') ?? '-' }}</span>
            </div>
        </div>

        <!-- 説明 -->
        @if ($quote->description)
            <div class="description">
                <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">{{ $quote->description }}</pre>
            </div>
        @endif

        <!-- 明細テーブル -->
        @if ($quote->items && $quote->items->count() > 0)
            <table class="table">
                <thead>
                    <tr>
                        <th>項目</th>
                        <th class="right-align">数量</th>
                        <th class="right-align">単価</th>
                        <th class="right-align">金額</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($quote->items as $item)
                        <tr>
                            <td>{{ $item->name }}</td>
                            <td class="right-align">{{ $item->quantity }}</td>
                            <td class="right-align">¥{{ number_format($item->unit_price, 0) }}</td>
                            <td class="right-align">¥{{ number_format($item->quantity * $item->unit_price, 0) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <!-- 金額計算 -->
        <div class="amount-table">
            <div class="amount-row">
                <span class="amount-label">小計</span>
                <span class="amount-value">¥{{ number_format($quote->subtotal_amount ?? 0, 0) }}</span>
            </div>
            @if ($quote->discount_amount > 0)
                <div class="amount-row">
                    <span class="amount-label">割引</span>
                    <span class="amount-value">-¥{{ number_format($quote->discount_amount, 0) }}</span>
                </div>
            @endif
            @if ($quote->tax_rate > 0)
                <div class="amount-row">
                    <span class="amount-label">消費税（{{ $quote->tax_rate }}%）</span>
                    <span class="amount-value">¥{{ number_format($quote->tax_amount ?? 0, 0) }}</span>
                </div>
            @endif
            <div class="total-row">
                <span class="total-label">合計金額</span>
                <span class="total-value">¥{{ number_format($quote->total_amount ?? 0, 0) }}</span>
            </div>
        </div>

        <!-- 注記 -->
        <div class="note">
            <p>
                <strong>ご不明な点やご質問がございましたら、お気軽にお問い合わせください。</strong><br>
                この見積書は発行日から{{ $quote->expiry_date ? $quote->expiry_date->diffInDays($quote->created_at) : '30' }}日間有効です。
            </p>
        </div>
    </div>
</body>

</html>
