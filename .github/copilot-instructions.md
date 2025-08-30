# AI Agent Instructions for Investment App Monorepo

## アーキテクチャ概要

### フロントエンド (Next.js)
- `frontend/`配下で**Pages Router**と**App Router**の両方をサポート
- ChakraUIとApollo Clientを使用
- プロバイダー設定は`app/providers.tsx`で一元管理

### バックエンド (Flask + GraphQL)
- DDDアーキテクチャを採用:
  - `domain/`: ビジネスロジックとモデル
  - `application/`: ユースケース
  - `infrastructure/`: DB/外部サービス連携
  - `interfaces/`: APIエンドポイント

## 重要な開発ワークフロー

### 環境セットアップ
```bash
# 初回または依存関係の変更時
docker-compose up --build

# 通常の開発時
docker-compose up
```

### ホットリロード
- フロントエンド: `WATCHPACK_POLLING=true`で自動的に有効
- バックエンド: Flaskの開発サーバーが自動的にリロード

## プロジェクト固有のパターン

### フロントエンドパターン
- コンポーネントは`features/`下に機能単位で配置
- ページは`pages/`または`app/`に配置
- GraphQLクライアント設定は`lib/apollo-client.ts`で管理

### バックエンドパターン
- リポジトリパターンを使用（例: `user_repository.py`）
- GraphQLスキーマは`interfaces/graphql/`下に定義
- モデルは`domain/models/`に配置

## 主要な統合ポイント

### GraphQL API
- エンドポイント: `http://localhost:5001/graphql`
- Playgroundで対話的に操作可能
- フロントエンドは`NEXT_PUBLIC_API_URL`環境変数で接続先を制御

### データベース
- PostgreSQL: `localhost:5432`
- 認証情報:
  - ユーザー: postgres
  - パスワード: postgres
  - DB名: investment_db

## Tips & 注意点
- node_modulesはDockerボリュームとして管理
- GitHubへのプッシュ時は`node_modules`を除外
- DDDの依存方向は常に内側へ向かうように実装
- フロントエンドの状態管理はApollo Clientのキャッシュを活用
