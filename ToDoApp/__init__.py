import os
from dotenv import load_dotenv
from flask import Flask
from flask_bootstrap import Bootstrap5
from flask_login import LoginManager

from .models import db, User
from .routes import main_bp
from .auth import auth_bp


def create_app():
    """
    Fabryka aplikacji: tworzy i zwraca instancję Flask,
    konfiguruje rozszerzenia oraz rejestruje trasy.
    """
    load_dotenv()

    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('FLASK_KEY')
    Bootstrap5(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DB_URI', "sqlite:///todolist.db")
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return db.get_or_404(User, user_id)

    with app.app_context():
        db.create_all()

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)

    return app