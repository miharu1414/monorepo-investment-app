# Investment App Monorepo

Next.js フロントエンドとFlask バックエンドを使用した投資アプリケーション

## プロジェクト構造

```
.
├── frontend/
│   ├── src/
│   │   ├── features/      # 再利用可能なコンポーネント
│   │   │   ├── auth/      # 認証関連のコンポーネント
│   │   │   ├── common/    # 共通コンポーネント
│   │   │   └── investments/ # 投資関連のコンポーネント
│   │   ├── pages/        # ページコンポーネント
│   │   ├── layouts/      # レイアウトコンポーネント
│   │   └── lib/         # ユーティリティ関数とAPI設定
│   └── app/             # Next.js App Router設定
│
├── backend/
│   ├── src/
│   │   ├── domain/          # ドメインモデルとビジネスロジック
│   │   │   ├── models/      # エンティティとバリューオブジェクト
│   │   │   └── services/    # ドメインサービス
│   │   ├── application/     # ユースケースとアプリケーションサービス
│   │   │   ├── usecases/    # ビジネスユースケース
│   │   │   └── services/    # アプリケーションサービス
│   │   ├── infrastructure/  # 外部サービスとの連携
│   │   │   ├── database/    # データベース関連
│   │   │   └── repositories/ # リポジトリの実装
│   │   └── interfaces/      # 外部とのインターフェース
│   │       ├── graphql/     # GraphQLスキーマと解決子
│   │       └── rest/        # RESTエンドポイント（必要な場合）
│   └── tests/              # テストファイル
└── docker-compose.yml     # 開発環境の設定

```

## 技術スタック

### フロントエンド
- Next.js 13 (App Router)
- TypeScript
- Chakra UI
- Apollo Client (GraphQL)

### バックエンド
- Python (Flask)
- GraphQL (Graphene)
- SQLAlchemy
- PostgreSQL

## セットアップと開発フロー

### 初期セットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/miharu1414/monorepo-investment-app.git
cd monorepo-investment-app
```

2. 環境変数の設定:
   - frontend/.env.localとbackend/.envを作成（テンプレートからコピー）

3. 開発環境の起動:
```bash
docker-compose up --build
```

### 開発ワークフロー

#### フロントエンド開発

1. 新機能の追加:
   - features/に機能別のコンポーネントを追加
   - pages/に新しいページを追加
   ```bash
   cd frontend
   # コンポーネントの作成
   mkdir -p src/features/[機能名]
   touch src/features/[機能名]/[コンポーネント名].tsx
   # ページの作成
   touch src/pages/[ページ名].tsx
   ```

2. コンポーネントの構造:
   ```typescript
   // src/features/common/Button/Button.tsx
   export const Button = () => {...}
   
   // src/features/common/Button/index.ts
   export * from './Button'
   ```

#### バックエンド開発

1. 新機能の追加:
   ```bash
   cd backend
   # ドメインモデルの追加
   touch src/domain/models/[モデル名].py
   # ユースケースの追加
   touch src/application/usecases/[ユースケース名].py
   # GraphQLスキーマの追加
   touch src/interfaces/graphql/[スキーマ名].py
   ```

2. DDDパターンに従った開発:
   - domain/: ビジネスロジックを定義
   - application/: ユースケースを実装
   - infrastructure/: 外部サービスとの連携を実装
   - interfaces/: APIエンドポイントを定義

### テスト実行

#### フロントエンド
```bash
cd frontend
npm run test
```

#### バックエンド
```bash
cd backend
python -m pytest
```

### アクセス方法

- フロントエンド: http://localhost:3000
- GraphQL Playground: http://localhost:5001/graphql
- PostgreSQL: localhost:5432
  - ユーザー名: postgres
  - パスワード: postgres
  - データベース名: investment_db

## デプロイメント

### フロントエンド (Vercel)

1. Vercelでプロジェクトを作成
2. 環境変数を設定
3. mainブランチにプッシュで自動デプロイ

### バックエンド (AWS)

- AWS ECSまたはElastic Beanstalkでデプロイ予定
- 本番環境の設定は準備中

## 開発ガイドライン

### コーディング規約

#### フロントエンド
- コンポーネントは機能ごとにfeatures/に配置
- ページレベルのコンポーネントはpages/に配置
- Atomic Designの原則に従う

#### バックエンド
- DDDのレイヤードアーキテクチャに従う
- 各レイヤーの責務を明確に分離
- 依存関係は内側に向かう

### ブランチ戦略

- main: 本番環境
- develop: 開発環境
- feature/*: 機能開発
- fix/*: バグ修正

## トラブルシューティング

1. コンテナの起動に失敗する場合:
```bash
# コンテナとボリュームを完全に削除
docker-compose down -v
# キャッシュを使用せずに再ビルド
docker-compose up --build --force-recreate
```

2. データベース接続エラー:
```bash
# PostgreSQLコンテナのログを確認
docker-compose logs db
```

3. GraphQL Playgroundにアクセスできない:
   - バックエンドのログを確認
   - CORSの設定を確認
   - ポートの競合がないか確認