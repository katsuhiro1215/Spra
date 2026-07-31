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
| SSL/リバースプロキシ | なし（localhost） | Caddyコンテナで自動HTTPS終端（Let's Encrypt証明書の取得・更新を自動化） |
| キュー | Redis導入済み（`compose.yaml`の`redis`サービス）。ワーカーは手動で`sail artisan horizon` | Horizonを常駐コンテナ（`restart: always`）として稼働。監視は`/admin/horizon`（owner/super_admin限定） |
| スケジューラ | 未実行 | `schedule:run`を毎分実行するcron（ホスト側 or 専用コンテナ） |
| バッチ失敗通知 | `MAIL_ADMIN_ADDRESS`宛にメール送信（`routes/console.php`で全コマンドに設定済み） | 本番でも同様。実際に届く宛先を`.env`の`MAIL_ADMIN_ADDRESS`に設定すること |

## 🔧 本番投入までに用意すべきもの（未着手・今後作成）

- [x] 本番用 `Dockerfile.prod`（マルチステージ: `composer install --no-dev --optimize-autoloader` → `npm run build` → 実行用イメージにCOPY）（2026-07-30完了、詳細はTASKS.md T15参照）
- [x] 本番用 `compose.prod.yaml`（バインドマウント無し、phpMyAdmin除外、Caddyによる自動HTTPS、Horizon/スケジューラ常駐サービス。Redisは専用の永続ボリュームを新設）（2026-07-30完了、詳細はTASKS.md T16参照）
- [ ] Lightsailインスタンスの作成・初期設定（後述）
- [ ] バックアップ方式の決定（DBダンプの定期取得・保存先）

### 🧩 compose.prod.yamlの構成（2026-07-30、T16で作成）

- `Dockerfile.prod`に`caddy`ステージを追加し、`app`（php-fpm）ステージと同じ絶対パス（`/var/www/html/public`）にビルド済み静的資材を配置している。これはCaddyの`php_fastcgi`がfastcgi経由でphp-fpmへ`SCRIPT_FILENAME`を渡す際、Caddy側のrootパスとphp-fpm側の実ファイルパスが一致している必要があるため（ボリューム共有はしていない。両イメージが同じビルドコンテキストから同じ内容をそれぞれ焼き込む方式）。
- サービス構成: `app`（php-fpm）、`caddy`（リバースプロキシ＋自動HTTPS、80/443番を公開）、`horizon`（`php artisan horizon`常駐）、`scheduler`（`schedule:run`を60秒間隔で呼び出すループ。Alpineベースのため通常のcronは使わない）、`mysql`、`redis`。
- 永続化: `app-storage`（アップロードファイル等、app/horizon/schedulerで共有）、`prod-mysql-data`、`prod-redis-data`、`caddy-data`/`caddy-config`（証明書・Caddy内部状態）。
- 新規`.env`変数: `APP_DOMAIN`（Caddyがリバースプロキシする本番ドメイン）、`CADDY_ACME_EMAIL`（Let's Encrypt証明書失効通知の宛先）。`.env.example`に追記済み。
- ローカル検証は`localhost`ドメインで実施（CaddyがLet's Encryptの代わりに内部CAで自己署名証明書を自動発行する挙動を利用）。実ドメインでの動作確認はT17（Lightsailインスタンス作成、DNS設定後）で行う。
- **Atlasサブドメイン（`ATLAS_DOMAIN`）も同時に公開する場合**（2026-07-30追記）: `Caddyfile`は`{$APP_DOMAIN}, {$ATLAS_DOMAIN}`の1ブロックで両ドメインを同じ`app:9000`バックエンドへ振り分ける構成にしている（Atlasはメインサイトとセッションを共有しない別ログイン導線だが、同一Laravelアプリ内でHostヘッダーを見て振り分けているため、Caddy側の設定は共通でよい）。DNS側でも`ATLAS_DOMAIN`（例: `atlas.example.com`）のAレコードをLightsailの静的IPに向ける必要がある（T18で`APP_DOMAIN`と同時に設定する）。

### ⚠️ ビルド時メモリ要件（2026-07-30、Dockerfile.prod検証で判明）

`npm run build`（Vite）が`mermaid`/`cytoscape`等の重量級ライブラリを含む大きなバンドルをビルドするため、**利用可能メモリが2GB程度だとビルド中にJavaScriptヒープ不足でOOMし、`docker compose build`が失敗する**ことをローカル検証で確認した（Docker Desktopのデフォルト割当2GBで実際に再現。8GBに増やして解消）。

このため、本ガイドの「2GBメモリ以上のプランを推奨」という記載は**ビルドを実行する環境については不十分な可能性が高い**。以下のいずれかで対応すること：

- Lightsailインスタンス自体を**4GB以上のプラン**にする（最も単純だが月額コストが上がる）
- 2GBプランのまま、**ビルド専用のswapファイルを一時的に追加**してから`docker compose -f compose.prod.yaml up -d --build`を実行する（ビルド後はswapを無効化・削除してもよい）
  ```bash
  sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile \
    && sudo mkswap /swapfile && sudo swapon /swapfile
  ```
- CI（GitHub Actions等）でイメージをビルドしてレジストリにpushし、Lightsail側は`docker compose pull`のみ行う（ビルドをLightsailインスタンス上で行わない）方式に変える

いずれを採用するかはT16（`compose.prod.yaml`作成）〜T17（Lightsailインスタンス作成）着手時に決定する。

## 🖥️ AWS Lightsail 構成手順（想定フロー）

1. **Lightsailインスタンス作成**
   - OS: Ubuntu 24.04 LTS の「OSのみ」テンプレート（Dockerは自前でインストールし、既存の`compose.yaml`をベースに構成する）
   - プラン: **4GB以上のメモリのプランを選択する**（K22参照。2GBプランは`npm run build`でOOMになるリスクが高いことをローカル検証で確認済みのため、2026-07-31の実デプロイでは4GBプランを選択した）
   - リージョン: 東京（ap-northeast-1）を選択（レイテンシ最小化）
2. **静的IPを取得してインスタンスにアタッチ**（Lightsailの「ネットワーキング」から作成）
3. **ファイアウォール設定**（Lightsailの「ネットワーキング」タブ）: 80(HTTP)/443(HTTPS)を「Any IPv4」で許可、22(SSH)はデフォルト許可のまま。3306(MySQL)は外部公開しない。
4. **Xserver側でDNS設定**: 管理画面のDNSレコード編集で、本番ドメインと`ATLAS_DOMAIN`サブドメイン（例: `atlas.example.com`）両方のAレコードを追加・変更しLightsailの静的IPを指す（ネームサーバーの変更は不要）。
   - **⚠️ 重要（K26、実デプロイで発生した障害）**: 切替前に、**MXレコードの参照先ホスト名を必ず確認すること**。MXが独立したサブドメイン（`mail.example.com`等）ではなく**ドメイン本体（`example.com`）自体**を指している場合、Web用のAレコードを書き換えるとメール受信も同時に止まる。該当する場合は、切替前に`mail.example.com`のような専用サブドメインを新設してXserverの元のサーバーIPを割り当て、MXの参照先をそちらに変更してからAレコードを切り替えること。
   - 切替の少なくとも半日〜1日前に対象AレコードのTTLを短く（300秒程度）しておき、安定確認後に元のTTL（3600等）に戻す。
5. **サーバーにDocker / Docker Composeをインストール**（Docker公式リポジトリ経由。`git`・GitHub CLI（`gh`）も併せてインストールし、プライベートリポジトリの認証に使う）
6. **リポジトリを取得**（`gh repo clone`、以降は`git pull`で更新）
7. **`.env`を本番用に設定**（下記チェックリスト参照。`DB_PASSWORD`はサーバー上で`openssl rand -base64 24`等で生成し、チャットやコミットに残さないこと）
8. **本番用コンテナのビルド・起動**
   ```
   docker compose -f compose.prod.yaml build
   docker compose -f compose.prod.yaml run --rm app php artisan key:generate
   docker compose -f compose.prod.yaml up -d
   ```
   - `compose.prod.yaml`の`app`/`horizon`/`scheduler`サービスは`.env`ファイル自体を`/var/www/html/.env`にマウントしている（`env_file`だけだとコンテナ内に実ファイルが存在せず、`key:generate`等ファイルへの直接書き込みを行うコマンドが失敗するため）。
9. **HTTPS設定**（Caddyコンテナが`APP_DOMAIN`/`ATLAS_DOMAIN`宛のLet's Encrypt証明書を初回起動時に自動取得・以降自動更新する。手動でのCertbot操作は不要）。DNS切替直後は証明書取得が失敗し長いバックオフに入ることがあるため、DNS伝播を確認した後に`docker compose -f compose.prod.yaml restart caddy`で再試行させると早く解決する。
10. **マイグレーション適用**
    ```
    docker compose -f compose.prod.yaml exec app php artisan migrate --force
    ```
11. **管理者権限カタログの同期**
    ```
    docker compose -f compose.prod.yaml exec app php artisan admin:sync-permissions
    ```
    → 同期後、管理画面から新規権限（例: `schedules.history`）を必要な管理者に付与する。
12. **キャッシュ最適化**
    ```
    docker compose -f compose.prod.yaml exec app php artisan config:cache
    docker compose -f compose.prod.yaml exec app php artisan route:cache
    docker compose -f compose.prod.yaml exec app php artisan view:cache
    ```
13. **キューワーカー・スケジューラが正常に稼働しているか確認**
14. **DBバックアップの定期実行を設定**（`scripts/backup-db.sh`を使用。保存先はLightsailインスタンス内`~/db-backups`のみ、直近7日分を自動保持。`crontab -e`で`0 4 * * * /home/ubuntu/Spra/scripts/backup-db.sh >> /home/ubuntu/db-backups/backup.log 2>&1`を登録）

## ✅ `.env` 本番設定チェックリスト

| 変数 | 内容 | 備考 |
|---|---|---|
| `APP_ENV` | `production` | |
| `APP_DEBUG` | `false` | エラー詳細を公開しない |
| `APP_URL` | 本番ドメイン（https://…） | |
| `DB_*` | 本番DB接続情報 | コンテナ内MySQLを使う場合はホスト名をサービス名（`mysql`）に |
| `APP_DOMAIN` | 本番ドメイン（スキーム無し） | `compose.prod.yaml`のCaddyがこのドメイン宛の証明書を自動取得する |
| `CADDY_ACME_EMAIL` | Let's Encrypt通知用メールアドレス | 証明書の期限切れ等の通知が届く |
| `SESSION_DOMAIN` | 本番ドメイン | |
| `SESSION_SECURE_COOKIE` | `true` | HTTPS化必須（本ガイドの手順9でCaddyが自動的にHTTPS終端する前提）。未設定のままだとCookieがHTTP経由でも送信されうる |
| `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` / `INSTAGRAM_PAGE_ACCESS_TOKEN` / `INSTAGRAM_VERIFY_TOKEN` | Meta Developer Consoleで取得した実値 | Webhook購読はHTTPS到達可能な本番URLでないと登録不可 |
| `SEARCH_CONSOLE_DRIVER` | `google` | `dummy`のままだと分析ダッシュボードの検索キーワードがダミー表示のまま |
| `SEARCH_CONSOLE_SITE_URL` / `SEARCH_CONSOLE_CREDENTIALS_PATH` | Search Console連携用の実値 | 本番でのみ検証可能 |
| `MAIL_*` (Postmark/Resend/SES) | 本番用APIキー | 予約通知・お問い合わせメール送信に必須 |
| `QUEUE_CONNECTION` | `redis`（現状踏襲） | Horizonがredisバックエンドを前提とするため。本チェックリストは以前`database`と誤記していたが、`.env.example`・Horizon運用の実態に合わせて訂正した（2026-07-31） |

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
