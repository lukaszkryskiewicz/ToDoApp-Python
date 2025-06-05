from flask import Flask, render_template
from flask_bootstrap import Bootstrap5

from .models import db

def create_app():
    """
    Fabryka aplikacji: tworzy i zwraca instancję Flask,
    konfiguruje rozszerzenia oraz rejestruje trasy.
    """
    app = Flask(__name__)
    Bootstrap5(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todolist.db"
    db.init_app(app)

    with app.app_context():
        db.create_all()


    return app