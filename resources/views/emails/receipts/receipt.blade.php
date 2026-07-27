<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>領収書のご送付</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .content {
            padding: 40px 30px;
        }

        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .info-row {
            display: table;
            width: 100%;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            display: table-cell;
            width: 140px;
            font-weight: bold;
            color: #667eea;
            vertical-align: top;
        }

        .info-value {
            display: table-cell;
        }

        .amount-box {
            text-align: center;
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }

        .amount-box .label {
            font-size: 14px;
            color: #6c757d;
        }

        .amount-box .amount {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            margin-top: 5px;
        }

        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }

        .footer p {
            margin: 5px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>領収書のご送付</h1>
        </div>

        <div class="content">
            <p>{{ $receipt->user->profile?->full_name ?? $receipt->user->email }} 様</p>

            <p>いつも大変お世話になっております。ご入金を確認いたしましたので、領収書をお送りいたします。</p>

            <div class="info-box">
                <div class="info-row">
                    <div class="info-label">領収書番号</div>
                    <div class="info-value">{{ $receipt->receipt_number }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">発行日</div>
                    <div class="info-value">{{ $receipt->issued_at->format('Y年m月d日') }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">お支払い内容</div>
                    <div class="info-value">{{ $receipt->invoice->contract->title }}</div>
                </div>
            </div>

            <div class="amount-box">
                <div class="label">ご入金金額（税込）</div>
                <div class="amount">¥{{ number_format($receipt->total_amount) }}</div>
            </div>

            <p>この度はご入金いただき、誠にありがとうございました。<br>
                今後とも何卒よろしくお願い申し上げます。</p>
        </div>

        <div class="footer">
            @include('emails.partials.organization-footer')
        </div>
    </div>
</body>

</html>
