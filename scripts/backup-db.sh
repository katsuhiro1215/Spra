#!/usr/bin/env bash
#
# 本番DBの定期バックアップ（T25）。
# compose.prod.yamlのmysqlサービスに対してmysqldumpを実行し、gzip圧縮して保存する。
# 保存先はLightsailインスタンス内のみ（~/db-backups）で、直近7日分のみ保持する。
#
# 使い方（Lightsailインスタンス上、cronから毎日実行する想定）:
#   0 4 * * * /home/ubuntu/Spra/scripts/backup-db.sh >> /home/ubuntu/db-backups/backup.log 2>&1

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$REPO_DIR/compose.prod.yaml"
BACKUP_DIR="$HOME/db-backups"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEST="$BACKUP_DIR/spra-db-$TIMESTAMP.sql.gz"

cd "$REPO_DIR"

docker compose -f "$COMPOSE_FILE" exec -T mysql sh -c \
  'exec mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' \
  | gzip > "$DEST"

# 直近N日分のみ保持し、それより古いバックアップは削除する
find "$BACKUP_DIR" -name 'spra-db-*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete

echo "$(date '+%Y-%m-%d %H:%M:%S') Backup created: $DEST"
