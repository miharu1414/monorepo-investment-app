from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from src.infrastructure.database.models import db, UserModel
from src.interfaces.graphql.schema import schema

def create_app():
    app = Flask(__name__)
    CORS(app, resources={
        r"/graphql": {
            "origins": ["http://localhost:3000"],
            "methods": ["OPTIONS", "POST", "GET"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    })

    # データベース設定
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/investment_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # JWT設定
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # 本番環境では環境変数から取得すべき
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # 開発環境用の設定
    jwt = JWTManager(app)

    db.init_app(app)
    migrate = Migrate(app, db)

    with app.app_context():
        db.create_all()
        
        # テストユーザーの作成
        if not UserModel.query.filter_by(email='test@example.com').first():
            test_user = UserModel(
                username='test',
                email='test@example.com'
            )
            test_user.set_password('password')
            db.session.add(test_user)
            db.session.commit()

    # GraphQLエンドポイントの設定
    app.add_url_rule(
        '/graphql',
        view_func=GraphQLView.as_view(
            'graphql',
            schema=schema,
            graphiql=True  # 開発環境用のGraphiQLインターフェースを有効化
        )
    )

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
