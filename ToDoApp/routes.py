from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from .models import db, ToDoList, ToDoItem, User

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def home():
    if current_user.is_authenticated:
        logged_user = db.session.execute(db.select(User)).scalar()
        return render_template('dashboard.html', logged_user = logged_user)
    return render_template('index.html')

@main_bp.route('/list/add', methods=['POST'])
@login_required
def list_add():
    title = request.form.get('title', '').strip()
    if not title:
        return jsonify(success=False, error='Title cannot be empty!'), 400

    new_list = ToDoList(title=title, user=current_user)
    db.session.add(new_list)
    db.session.commit()

    html = render_template('partials/list_card.html', lst=new_list)
    return jsonify(success=True, html=html)