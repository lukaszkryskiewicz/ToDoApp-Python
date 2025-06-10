from datetime import datetime

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


@main_bp.route('/list/<int:list_id>/item/add', methods=['POST'])
@login_required
def item_add(list_id):
    current_list = ToDoList.query.filter_by(
        id=list_id, user_id=current_user.id
    ).first()

    from_list = request.form.get('from_list', '').lower() == 'true'
    if not current_list:
        return jsonify(success=False, error="List not found"), 404

    title = request.form.get('title', '').strip()
    due_date_str = request.form.get('due_date', '').strip()
    details = request.form.get('details', None).strip()
    if due_date_str:
        try:
            due_date = datetime.fromisoformat(due_date_str)
        except ValueError:
            return jsonify(success=False, error='Wrong date format'), 400
    else:
        due_date = None

    if not title:
        return jsonify(success=False, error='Title cannot be empty!'), 400

    new_item = ToDoItem(title=title, due_date = due_date, details = details, to_do_list=current_list)
    db.session.add(new_item)
    db.session.commit()

    html = render_template('partials/item_view_list.html' if from_list else 'partials/item.html',
                           item=new_item,
                           list_id=list_id)
    return jsonify(success=True, html=html)

@main_bp.route('/list/<int:list_id>')
@login_required
def list_details(list_id):
    current_list = ToDoList.query.filter_by(
        id=list_id, user_id=current_user.id
    ).first()

    if not current_list:
        return

    return render_template('view_list.html', todo_list = current_list)

@main_bp.route('/list/<int:list_id>/edit', methods=['POST'])
@login_required
def list_edit(list_id):
    current_list = ToDoList.query.filter_by(
        id=list_id, user_id=current_user.id
    ).first_or_404()

    new_title = request.form.get('title', '').strip()

    if not new_title:
        return jsonify(success=False, error="Tytuł nie może być pusty"), 400

    current_list.title = new_title
    db.session.commit()

    return jsonify(success=True, title=current_list.title)

@main_bp.route('/list/<int:list_id>/toggle-fav', methods=['POST'])
@login_required
def toggle_list_fav(list_id):
    lst = ToDoList.query.filter_by(id=list_id, user_id=current_user.id).first_or_404()
    lst.is_favorite = not lst.is_favorite
    db.session.commit()
    return jsonify(success=True, is_favorite=lst.is_favorite)

@main_bp.route('/list/<int:list_id>/del')
@login_required
def delete_list(list_id):
    lst = ToDoList.query.filter_by(id=list_id, user_id=current_user.id).first_or_404()
    db.session.delete(lst)
    db.session.commit()
    return render_template('dashboard.html', logged_user = current_user)


