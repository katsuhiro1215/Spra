# 本番環境デプロイ手順書（AWS + Docker）

## 📋 前提・構成方針

- **ドメイン**: Xserverで登録済みのドメインをそのまま使用。Xserverの管理画面でDNSレコード管理も継続し、**ネームサーバーの移管は行わない**（AレコードでAWS側を指すだけで良い）。
- **サーバー**: 既存のAWSアカウント（開発用に少し使用）を、この中央管理システムの本番環境として使う。
- **ホスティング方式**: AWS Lightsail の **インスタンス（VM）** 上でDocker/Docker Composeを動かす方式を採用。理由:
  - 現在の`compose.yaml`（Laravel Sail構成: アプリ+MySQL+phpMyAdmin）をほぼそのまま本番用に転用できる
  - Lightsail Container Service（マネージド型）は`docker-compose`をそのまま使えず、DBもコンテナで持てない（RDS前提になりコストが増える）ため、個人利用の中央管理システムには過剰
  - EC2を素で使うよりVPC/セキュリティグループ設計の手間が少なく、固定IP・HTTPS・ファイアウォールがLightsailのUI内で完結する
- **SaaS**: 別プロジェクトのため今回は対象外。将来的には別AWSアカウント（Organizations配下）に分離する方針（別途検討）。
- **運用方針**: 本番投入後、1週間程度は自己検証のみ行い、問題なければ公表する。

## ⚠️ 現状（開発環境）と本番環境の違い

現在の`compose.yaml`はLaravel Sailが生成した**開発専用構成**であり、そのまま本番投入すべきではない。

| 項目 | 開発環境（現状） | 本番環境（必要な変更） |
|---|---|---|
| コード配置 | `.:/var/www/html` をバインドマウント | イメージにCOPYして焼き込む（マウントしない） |
| PHPイメージ | `vendor/laravel/sail/runtimes/8.4`（開発ツール込み） | 本番用に軽量化したマルチステージDockerfile |
| フロントエンド | `npm run dev`（Vite HMR） | `npm run build`済みの`public/build`をイメージに含める |
| phpMyAdmin | 起動している | 本番では起動しない、または外部公開しない（SSHポートフォワード経由のみ） |
| `.env` | `APP_ENV=local`, `APP_DEBUG=true` | `APP_ENV=production`, `APP_DEBUG=false` |
| SSL/リバースプロキシ | なし（localhost） | nginx（またはCaddy）コンテナ + Let's Encryptで HTTPS終端 |
| キューワーカー | 手動で`sail artisan queue:work` | 常駐コンテナ（`restart: always`）として稼働 |
| スケジューラ | 未実行 | `schedule:run`を毎分実行するcron（ホスト側 or 専用コンテナ） |

## 🔧 本番投入までに用意すべきもの（未着手・今後作成）

- [ ] 本番用 `Dockerfile.prod`（マルチステージ: `composer install --no-dev --optimize-autoloader` → `npm run build` → 実行用イメージにCOPY）
- [ ] 本番用 `compose.prod.yaml`（バインドマウント無し、phpMyAdmin除外、nginx+Let's Encrypt、キューワーカー/スケジューラ用サービス追加）
- [ ] Lightsailインスタンスの作成・初期設定（後述）
- [ ] バックアップ方式の決定（DBダンプの定期取得・保存先）

## 🖥️ AWS Lightsail 構成手順（想定フロー）

1. **Lightsailインスタンス作成**
   - OS: Ubuntu 22.04/24.04 LTS の「OSのみ」テンプレート（Dockerは自前でインストールし、既存の`compose.yaml`をベースに構成する）
   - プラン: Laravel + MySQL + Node ビルドを1台で動かすため、最低でも **2GBメモリ以上のプラン**を推奨（512MB/1GBプランはビルド時にOOMになりやすい）
   - リージョン: 東京（ap-northeast-1）を選択（レイテンシ最小化）
2. **静的IPを取得してインスタンスにアタッチ**（Lightsailの「ネットワーキング」から作成）
3. **ファイアウォール設定**（Lightsailの「ネットワーキング」タブ）: 80(HTTP)/443(HTTPS)/22(SSH、可能なら自分のIPのみに制限)を許可。3306(MySQL)は外部公開しない。
4. **Xserver側でDNS設定**: 管理画面のDNSレコード編集で、Aレコードを追加しLightsailの静的IPを指す（ネームサーバーの変更は不要）。
5. **サーバーにDocker / Docker Composeをインストール**
6. **リポジトリを取得**（git clone、以降は`git pull`で更新）
7. **`.env`を本番用に設定**（下記チェックリスト参照）
8. **本番用コンテナのビルド・起動**
   ```
   docker compose -f compose.prod.yaml up -d --build
   ```
9. **HTTPS設定**（nginxコンテナ + Certbot でLet's Encrypt証明書を取得、自動更新をcron/コンテナで設定）
10. **マイグレーション適用**
    ```
    docker compose exec laravel.test php artisan migrate --force
    ```
11. **管理者権限カタログの同期**
    ```
    docker compose exec laravel.test php artisan admin:sync-permissions
    ```
    → 同期後、管理画面から新規権限（例: `schedules.history`）を必要な管理者に付与する。
12. **キャッシュ最適化**
    ```
    docker compose exec laravel.test php artisan config:cache
    docker compose exec laravel.test php artisan route:cache
    docker compose exec laravel.test php artisan view:cache
    ```
13. **キューワーカー・スケジューラが正常に稼働しているか確認**
14. **DBバックアップの定期実行を設定**（cronで`mysqldump`をS3等へアップロードする、等）

## ✅ `.env` 本番設定チェックリスト

| 変数 | 内容 | 備考 |
|---|---|---|
| `APP_ENV` | `production` | |
| `APP_DEBUG` | `false` | エラー詳細を公開しない |
| `APP_URL` | 本番ドメイン（https://…） | |
| `DB_*` | 本番DB接続情報 | コンテナ内MySQLを使う場合はホスト名をサービス名に |
| `SESSION_DOMAIN` | 本番ドメイン | |
| `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` / `INSTAGRAM_PAGE_ACCESS_TOKEN` / `INSTAGRAM_VERIFY_TOKEN` | Meta Developer Consoleで取得した実値 | Webhook購読はHTTPS到達可能な本番URLでないと登録不可 |
| `SEARCH_CONSOLE_DRIVER` | `google` | `dummy`のままだと分析ダッシュボードの検索キーワードがダミー表示のまま |
| `SEARCH_CONSOLE_SITE_URL` / `SEARCH_CONSOLE_CREDENTIALS_PATH` | Search Console連携用の実値 | 本番でのみ検証可能 |
| `MAIL_*` (Postmark/Resend/SES) | 本番用APIキー | 予約通知・お問い合わせメール送信に必須 |
| `QUEUE_CONNECTION` | `database`（現状踏襲） | ワーカー常駐が前提 |

## 💰 費用が発生するポイント（要注意）

個人利用の中央管理システムなので、想定外の課金を避けるために特に確認しておきたい点。

- **Lightsailインスタンス料金**: 起動している間は常に時間課金（月額固定プランとして請求）。停止していてもディスク（SSD）分は課金され続けるため、「止めれば無料」ではない。不要になったら**スナップショットを取ってからインスタンス自体を削除**する。
- **静的IP**: インスタンスにアタッチしている間は無料。**デタッチした状態で保持しているとその分課金される**ため、インスタンスを作り直す場合は忘れずに再アタッチ or 解放する。
- **データ転送量（アウト方向）**: Lightsailは月間データ転送量にプランごとの上限があり、超過分は追加課金。個人利用なら通常は上限内だが、Instagram Webhookやアクセス解析等で想定より通信が増えた場合は要確認。
- **自動スナップショット**: 有効にすると保存容量に応じて別途課金される。バックアップは重要だが、**保持世代数を絞る**（例: 直近7日分のみ等）ことでコストを抑える。
- **無料利用枠（Free Tier）**: 既存の開発用アカウントの場合、アカウント作成から12ヶ月を過ぎていると新規アカウント向けの無料枠は使えない可能性が高い。**このアカウントがいつ作成されたか確認**しておくこと。
- **RDS等マネージドサービスへの誘導**: 今回はコスト最小化のためMySQLもコンテナ内で運用する方針。将来的に「マネージドDBの方が楽そう」とRDSに切り替えると、Lightsailインスタンス本体より高くつくことが多いので、必要になるまでは見送る。
- **想定外リソースの放置**: 検証用に一時的に作ったEC2インスタンスやElastic IP（未アタッチ）、スナップショットなどを削除し忘れると課金され続ける。**AWS Budgets でひと月の金額アラートを設定**しておくことを強く推奨（例: 月額想定の1.5倍を超えたら通知）。

## 🔍 1週間の自己検証で重点的に見るポイント

- [ ] 予約が実際に飛んできて通知メールが届くか
- [ ] 予約リマインダーバッチが定刻に動作するか（キューワーカー・スケジューラ双方の稼働確認）
- [ ] Instagram DMからの導線が `source=instagram` として正しく記録されるか（Webhook購読・署名検証含む）
- [ ] Search Console連携が実データを取得できているか（`SEARCH_CONSOLE_DRIVER=google`切替後）
- [ ] スケジュール変更履歴・営業中判定APIが本番データで正しく機能するか
- [ ] AWS請求ダッシュボードで想定通りの金額になっているか（初週は特にこまめに確認）
