<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>契約書のご送付</title>
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

        h2 {
            color: #1f2937;
            font-size: 18px;
            margin-top: 30px;
            margin-bottom: 10px;
        }

        .contract-list {
            padding: 0 0 0 20px;
            margin: 10px 0;
        }

        .contract-list li {
            margin: 6px 0;
        }

        .steps {
            background-color: #f0f9ff;
            border-left: 4px solid #667eea;
            padding: 15px 15px 15px 35px;
            margin: 20px 0;
            border-radius: 4px;
        }

        .steps li {
            margin: 8px 0;
            color: #1f2937;
        }

        .notice-box {
            background-color: #fffbeb;
            border-left: 4px solid #d97706;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 10px 0;
        }

        .cta-section {
            text-align: center;
            background-color: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
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
            <h1>契約書のご送付</h1>
        </div>

        <div class="content">
            <p>{{ $contractGroup->user?->profile?->full_name ?? $contractGroup->user?->email }} 様</p>

            <p>いつも大変お世話になっております。契約書を送付いたしましたので、添付のPDFまたはWebよりご確認ください。
                {{ $contractGroup->contracts->count() }}件の契約書をお送りいたします。</p>

            <div class="info-box">
                <div class="info-row">
                    <div class="info-label">グループ番号</div>
                    <div class="info-value">{{ $contractGroup->group_number }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">タイトル</div>
                    <div class="info-value">{{ $contractGroup->title }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">契約件数</div>
                    <div class="info-value">{{ $contractGroup->contracts->count() }}件</div>
                </div>
            </div>

            <h2>含まれる契約書</h2>
            <ul class="contract-list">
                @foreach ($contractGroup->contracts as $contract)
                    <li>{{ $contract->title }}（{{ $contract->contract_number }}）</li>
                @endforeach
            </ul>

            <h2>次のステップ</h2>
            <ol class="steps">
                <li>以下の添付ファイルをご確認ください</li>
                <li>内容に不備がないかご確認の上、署名をお願いいたします</li>
                <li>複数の契約書が含まれています。すべてにご署名ください</li>
            </ol>

            @if ($terms)
                <div class="notice-box">
                    <strong>規約・利用条件</strong>：この契約に関連する規約（v{{ $terms->version }}）を添付ファイルでお送りしております。ご確認ください。
                </div>
            @endif

            <div class="cta-section">
                <p style="margin-top: 0; font-size: 15px; font-weight: 600; color: #1f2937;">
                    契約書の確認・署名はこちらから
                </p>
                <a href="{{ route('user.contract.index') }}" class="cta-button">
                    契約書を確認する
                </a>
            </div>

            <p>ご不明な点やご質問がございましたら、お気軽にお問い合わせください。<br>
                よろしくお願いいたします。</p>
        </div>

        <div class="footer">
            @include('emails.partials.organization-footer')
        </div>
    </div>
</body>

</html>
