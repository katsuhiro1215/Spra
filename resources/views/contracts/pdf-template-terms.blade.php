<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>契約書 - 契約条項</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        h1 {
            font-size: 16px;
            margin: 10px 0;
            text-align: center;
        }

        h2 {
            font-size: 14px;
            margin: 15px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
            background-color: #f0f0f0;
            padding: 5px;
        }

        .content {
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.8;
            padding: 10px;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #999;
            padding-top: 10px;
        }

        .page-number {
            text-align: right;
            font-size: 10px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>契約書</h1>
        <p>契約番号：{{ $contract->contract_number }}</p>
    </div>

    <h2>契約条項</h2>
    <div class="content">
        {{ $terms }}
    </div>

    <div class="footer">
        <p>本契約書は重要な法的文書です。内容をご理解の上、署名してください。</p>
        <div class="page-number">ページ 2/4</div>
    </div>
</body>

</html>
