from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from src.infrastructure.database.models import db
from src.interfaces.graphql.schema import schema

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/graphql": {"origins": "*"}})

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/investment_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

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

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
