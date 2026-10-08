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
| `SEARCH_CONSOLE_DRIVER` | `google` | `dummy`のままだと分析ダッシュボードの検索キーワードがダミー表示のまま。`google`は`GoogleSearchConsoleService`として実装済み（2026-07-31） |
| `SEARCH_CONSOLE_SITE_URL` | Search Consoleのプロパティ名 | ドメインプロパティなら`sc-domain:example.com`、URLプレフィックスなら`https://example.com/` |
| `SEARCH_CONSOLE_CREDENTIALS_PATH` | サービスアカウントJSON鍵ファイルのパス | 未設定時は`storage/app/private/google-search-console-service-account.json`（`storage/app/private/`はgit管理外）。GCPでサービスアカウントを作成し、そのメールアドレスをSearch Console側の「設定→ユーザーと権限」で「フル」権限のユーザーとして追加しておく必要がある |
| `MAIL_*` | 実際のSMTP認証情報（例: Xserverのメールアカウント） | 予約通知・お問い合わせメール送信に必須。`MAIL_ENCRYPTION`はこのLaravelバージョン（12）の`config/mail.php`から参照されず無効。暗号化方式は`MAIL_SCHEME`で指定する（ポート465/暗黙的TLSなら`MAIL_SCHEME=smtps`、ポート587/STARTTLSなら未設定のままでよい） |
| `QUEUE_CONNECTION` | `redis`（現状踏襲） | Horizonがredisバックエンドを前提とするため。本チェックリストは以前`database`と誤記していたが、`.env.example`・Horizon運用の実態に合わせて訂正した（2026-07-31） |

### ⚠️ `.env`変更後の反映方法（重要）

`compose.prod.yaml`の`app`/`horizon`/`scheduler`は`env_file: .env`で環境変数を読み込むが、これは**コンテナ作成時点の値で固定**される。`.env`ファイルを更新して`docker compose restart <service>`しても、既存コンテナの環境変数は更新されない（Laravelは`.env`ファイルより既存のOS環境変数を優先するため、`config:clear`→`config:cache`をやり直しても解決しない）。

`.env`の値を変更した場合は、必ず以下でコンテナを作り直すこと。

```bash
docker compose -f compose.prod.yaml up -d --force-recreate app horizon scheduler
```

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
- [x] Search Console連携（2026-07-31）。DNS所有権確認（TXT）完了、サービスアカウント作成・Search Console側への権限付与・本番`.env`設定（`SEARCH_CONSOLE_DRIVER=google`/`SEARCH_CONSOLE_SITE_URL=sc-domain:smartsprouts.jp`）・鍵ファイル配置（`docker cp`でコンテナ内`storage/app/private/`へ、named volumeのためホスト側配置では反映されない点に注意）まで完了し、`analytics:sync-search-console`が正常終了することを確認（新規ドメインのためクエリ0件、データ反映まで数日のラグは想定通り）
- [ ] スケジュール変更履歴・営業中判定APIが本番データで正しく機能するか
- [ ] AWS請求ダッシュボードで想定通りの金額になっているか（初週は特にこまめに確認）

## 📌 本番反映の履歴

本番がどのコミットまで反映済みかを追えるよう、反映のたびに1行追記する（反映後に本番で`git log -1 --oneline`を実行して確認した値を書く）。

| 日付 | 反映前 | 反映後 | 主な内容 | 備考 |
|---|---|---|---|---|
| 2026-10-01 | `ae62957` | `6ef8b9b` | 見積回答の辞退理由、予約とお問い合わせの紐付け（`{hearing_link}`）、AI社員日報など53コミット・マイグレーション9本 | Docker構成・依存関係の変更なし。戻す場合は`ae62957`を基準にする。見積シミュレーターAPI化（PR #102）は未マージのため含まない |

## 🔁 定型の更新手順（コードの反映）

```bash
cd ~/Spra
git status                      # 本番サーバー上で直接修正したファイルが無いか確認（あれば先に退避）
./scripts/backup-db.sh          # DBバックアップ
git pull && git log -1 --oneline
docker compose -f compose.prod.yaml build
docker compose -f compose.prod.yaml up -d
docker compose -f compose.prod.yaml exec app php artisan migrate --force
docker compose -f compose.prod.yaml exec app php artisan admin:sync-permissions
# ↓ 新しい権限が増えた場合のみ、次節の「既存の権限を上書きしない権限付与」を実行
docker compose -f compose.prod.yaml exec app php artisan optimize:clear
docker compose -f compose.prod.yaml exec app php artisan optimize
```

### ⚠️ 本番で実行してはいけないもの

- `php artisan db:seed`（全体実行）および`migrate:fresh`: 本番データを上書き・消去する
- `RolePermissionSeeder`: `syncPermissions`のため、管理画面の権限マトリクスで行った調整がすべて初期値に戻る
- `ResponseTemplateSeeder`: 既存テンプレートが重複登録される（2026-10-01、開発DBで6件重複した実例あり）。テンプレートを追加する場合は`firstOrCreate`で1件ずつ投入する

### 既存の権限を上書きしない権限付与

`admin:sync-permissions`はルート名から権限の一覧を作るだけで、ロールへの付与はしない。新しい画面を追加した後は、**どのロールにもまだ付いていない新規権限だけ**に、`config/admin_permissions.php`の初期ルール（adminは`destroy`以外、editor/ai_staffは`index`/`show`のみ、owner/super_adminは全権限）で付与する。既存の権限は変更しないため、管理画面での調整は保持される。以下を**1行のまま**実行する。

```bash
docker compose -f compose.prod.yaml exec app php artisan tinker --execute='use Spatie\Permission\Models\Permission; use Spatie\Permission\Models\Role; use Illuminate\Support\Str; use App\Models\Admin; $new=Permission::where("guard_name","admins")->whereDoesntHave("roles")->get(); echo "新規権限: ".$new->count()."件".PHP_EOL; foreach(array_keys(Admin::ROLES) as $n){ Role::firstOrCreate(["name"=>$n,"guard_name"=>"admins"]); } $act=fn($p)=>Str::afterLast($p->name,"."); foreach(array_diff(array_keys(Admin::ROLES),Admin::RESTRICTABLE_ROLES) as $n){ Role::findByName($n,"admins")->givePermissionTo($new); } Role::findByName("admin","admins")->givePermissionTo($new->reject(fn($p)=>in_array($act($p),config("admin_permissions.admin_role_excluded_actions")))); Role::findByName("editor","admins")->givePermissionTo($new->filter(fn($p)=>in_array($act($p),config("admin_permissions.editor_role_allowed_actions")))); Role::findByName("ai_staff","admins")->givePermissionTo(Permission::where("guard_name","admins")->get()->filter(fn($p)=>in_array($act($p),config("admin_permissions.ai_staff_role_allowed_actions")))); app(Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions(); echo "完了: ai_staffロールあり=".(Role::where("name","ai_staff")->exists()?"はい":"いいえ").PHP_EOL;'
```

`新規権限: ○件`と`完了: ai_staffロールあり=はい`が出れば成功。`新規権限: 0件`なら付与対象が無かっただけで問題ない。

## 🧰 同居アプリ katsuooool（`katsuooool.smartsprouts.jp`）

Web制作ツール katsuooool を、本体と同じLightsailインスタンスに**別のComposeプロジェクト**（`name: katsuooool`）として載せている。本体側で持つのは`Caddyfile`の`katsuooool.smartsprouts.jp`ブロックだけで、本体の`compose.prod.yaml`は変更しない（2026-10-08、案A）。

### 役割分担

| 担当 | 内容 |
|---|---|
| 本体Caddy（Spra） | `katsuooool.smartsprouts.jp`のHTTPS終端（証明書は自動取得）、HSTS、アクセスログ（`/data/katsuooool-access.log`）、`katsuooool-web:80`への`reverse_proxy` |
| katsuooool側のWebコンテナ | `public/`（`public/build`など）の静的配信、php-fpm（`katsuooool-app:9000`）へのfastcgi、HSTS以外のセキュリティヘッダー |

### katsuooool側のWebコンテナに必要な条件

- 本体のネットワーク`spra_prod`（`external: true`）に**エイリアス`katsuooool-web`**で参加し、**80番（HTTP）**で待ち受ける。TLSは本体Caddyで終端するため、Webコンテナ側で証明書は取得しない。
- 本体Caddyが付ける`X-Forwarded-For`/`X-Forwarded-Proto`/`X-Forwarded-Host`をphp-fpmまでそのまま渡す。WebコンテナにCaddyを使う場合は、グローバル設定の`servers { trusted_proxies static private_ranges }`を入れないと、`X-Forwarded-For`が本体CaddyのIPに置き換えられ、アプリから利用者のIPが取れなくなる（nginxの場合は`fastcgi_params`の既定で`HTTP_X_FORWARDED_*`が渡る）。
- 画像アップロードのサイズ上限・処理時間の上限はkatsuooool側（Webコンテナとphp-fpm）で決める。本体Caddyの`reverse_proxy`には本文サイズ・応答時間の上限を設定していない。

### 本番への反映順

1. katsuooool側をデプロイし、`docker network inspect spra_prod`で`katsuooool-web`が参加していることを確認する。
2. Xserverで`katsuooool.smartsprouts.jp`のAレコードをLightsailの静的IPへ向け、`dig +short katsuooool.smartsprouts.jp`で反映を確認する（DNSが反映される前にCaddyを更新すると、証明書の取得に失敗して長い待機に入るため）。
3. 本体のCaddyを更新する（`Caddyfile`はCaddyイメージに焼き込んでいるため、イメージの作り直しが必要）。

```bash
cd ~/Spra
git pull
docker compose -f compose.prod.yaml build caddy
# 新しいイメージで設定を検証（本体には影響しない）
docker compose -f compose.prod.yaml run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile
# Caddyだけを作り直す。数秒間、本体サイトにもつながらなくなる（証明書はcaddy-dataボリュームに残る）
docker compose -f compose.prod.yaml up -d caddy
docker compose -f compose.prod.yaml logs --tail=50 caddy   # katsuooool.smartsprouts.jp の証明書取得ログを確認
```

4. 確認: `https://katsuooool.smartsprouts.jp/up`が200、トップと画像ツール画面の表示、`/build/*`の取得、画像変換（AVIF含む）、本体`https://smartsprouts.jp`が今までどおり表示されること。

- katsuooool側が停止していても本体Caddyは起動でき、`katsuooool.smartsprouts.jp`だけが502になる（転送先の名前解決はリクエスト時に行うため）。
- 本体の`smartsprouts.jp`は`includeSubDomains`付きのHSTSを返しているため、ブラウザは`katsuooool.smartsprouts.jp`にもHTTPSで接続する。HTTPのまま公開することはできない。
