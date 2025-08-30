from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from models import db
from schema import schema

app = Flask(__name__)
CORS(app, resources={r"/graphql": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/investment_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# データベースのテーブルを作成
with app.app_context():
    db.create_all()

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True
    )
)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
