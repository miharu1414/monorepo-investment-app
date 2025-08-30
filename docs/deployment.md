# デプロイメントガイド

## Vercelへのデプロイ

### 準備
1. Vercelアカウントの作成
2. GitHubリポジトリとの連携

### フロントエンドのデプロイ手順
1. Vercelダッシュボードで新規プロジェクトを作成
2. GitHubリポジトリを選択
3. 以下の環境変数を設定:
   ```
   NEXT_PUBLIC_API_URL=https://api.your-domain.com/graphql
   ```
4. ビルド設定:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 自動デプロイ
- mainブランチへのプッシュで自動的にデプロイ
- プレビューデプロイはPull Request作成時に自動実行

## AWSへのデプロイ

### バックエンドのデプロイ (ECS Fargate)

#### 1. ECRリポジトリの作成
```bash
aws ecr create-repository --repository-name investment-app-backend
```

#### 2. コンテナのビルドとプッシュ
```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# イメージのビルドとタグ付け
docker build -t investment-app-backend ./backend
docker tag investment-app-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/investment-app-backend:latest

# ECRにプッシュ
docker push $AWS_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/investment-app-backend:latest
```

#### 3. ECSクラスターの作成
```bash
aws ecs create-cluster --cluster-name investment-app-cluster
```

#### 4. タスク定義の作成
```json
{
  "family": "investment-app-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/investment-app-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:password@your-rds-endpoint:5432/investment_db"
        }
      ]
    }
  ]
}
```

#### 5. RDSの設定
1. PostgreSQLインスタンスの作成
2. セキュリティグループの設定
3. データベースの初期化

#### 6. ALBの設定
1. ターゲットグループの作成
2. リスナールールの設定
3. SSL/TLS証明書の適用

### CI/CD設定

#### GitHub Actions workflow
`.github/workflows/deploy.yml`を作成:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1
      
      - name: Build and push to ECR
        run: |
          aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.ap-northeast-1.amazonaws.com
          docker build -t investment-app-backend ./backend
          docker tag investment-app-backend:latest ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.ap-northeast-1.amazonaws.com/investment-app-backend:latest
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.ap-northeast-1.amazonaws.com/investment-app-backend:latest
      
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster investment-app-cluster --service backend-service --force-new-deployment

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```
