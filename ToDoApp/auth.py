from flask import (
    Blueprint, render_template, request, redirect, url_for, flash
)
from flask_login import login_required, current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from .forms import LoginForm, RegisterForm
from .models import db, ToDoList, ToDoItem, User

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    login_form = LoginForm()

    if current_user.is_authenticated:
        return redirect(url_for('main.home'))

    if login_form.validate_on_submit():
        user = db.session.execute(db.select(User).where(User.email == login_form.email.data)).scalar()

        if not user or not check_password_hash(user.password_hash, login_form.password.data):
            flash('Wrong password or login')
            return redirect(url_for('auth.login'))
        else:
            login_user(user)
            return redirect(url_for('main.home'))
    return render_template('login.html', form=login_form)


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    register_form = RegisterForm()

    if current_user.is_authenticated:
        return redirect(url_for('main.home'))

    if register_form.validate_on_submit():
        #check if user.email exists in db
        if db.session.execute(db.select(User).where(User.email == register_form.email.data)).scalar():
            flash('Email already exist, please log in')
            return redirect(url_for('auth.login'))
        hashed_password = generate_password_hash(register_form.password.data, 'scrypt', 8)
        new_user = User(
            email = register_form.email.data,
            password_hash = hashed_password,
            name = register_form.name.data
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for('main.home'))
    return render_template('register.html', form=register_form)

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))