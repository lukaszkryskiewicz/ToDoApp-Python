from flask import Flask, render_template
from flask_bootstrap import Bootstrap5

def create_app():
    """
    Fabryka aplikacji: tworzy i zwraca instancję Flask,
    konfiguruje rozszerzenia oraz rejestruje trasy.
    """
    app = Flask(__name__)
    Bootstrap5(app)


    return app