# マイグレーション修正チェックリスト

## 📋 確認済み内容

### Project テーブル（2025_11_09_000023）

- ✅ inquiry_id + 外部キー制約がある
- ⚠️ current_version_id がない → **追加必要**
- ✅ contract_id 存在

### ProjectMilestone テーブル（2025_11_11_000025）

- ⚠️ version_id がない → **追加必要**
- ✅ project_id 存在

### ProjectItem テーブル（2025_11_25_000040）

- ⚠️ version_id がない → **追加必要**
- ✅ project_id 存在
- ✅ quote_item_id 存在
- ✅ milestone_id 存在
- ✅ parent_id 存在

### ProjectVersion（新規）

- ✅ モデル作成済み
- ⚠️ マイグレーション **未作成** → **作成必要**

### ProjectUpdate（既存）

- 修正不要（project_id のみ参照、version_id なし）

## 🔧 実装順序

### 1️⃣ ProjectVersion マイグレーション作成（新規）

- Timestamp: 2026_07_10_XXXXXX_create_project_versions_table.php
- Fields: id, project_id, version, title, description, start_date, estimated_end_date, status, is_current, created_by, timestamps, softDeletes

### 2️⃣ Projects テーブル修正マイグレーション（down_invoice_deposit後）

- Drop: inquiry_id + foreign key
- Add: current_version_id + foreign key to project_versions
- Timestamp: 2026_07_10_XXXXXX_refactor_projects_for_version_management.php

### 3️⃣ ProjectMilestones テーブル修正マイグレーション

- Add: version_id + foreign key to project_versions
- Timestamp: 2026_07_10_XXXXXX_add_version_id_to_project_milestones_table.php

### 4️⃣ ProjectItems テーブル修正マイグレーション

- Add: version_id + foreign key to project_versions
- Timestamp: 2026_07_10_XXXXXX_add_version_id_to_project_items_table.php

### 5️⃣ Drop ProjectInquiries テーブル（オプション）

- 既に model/controller が削除されている可能性
- マイグレーション削除: 2025_11_08_000022_create_project_inquiries_table.php
- または drop マイグレーション作成

## ⚠️ 実装前確認事項

1. ProjectInquiry テーブルは存在しているか？
2. 既存データの扱い（テスト環境リセット OK？）
3. ProjectVersion v1 への既存データ migrate 方法
4. ProjectInquiry 廃止後のフロー（Contact のみ？）
