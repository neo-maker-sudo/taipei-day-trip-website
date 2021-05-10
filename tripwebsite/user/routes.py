from flask import Blueprint, request, jsonify, session, redirect, url_for
from tripwebsite.models import User
from tripwebsite import db

users = Blueprint('users', __name__)

@users.route("/api/user", methods=['GET','POST', 'PATCH', 'DELETE'])
def apiLogin():
    if request.method == 'POST':  #signup
        name = request.json['name']
        email = request.json['email']
        if name.isspace() or email.isspace():
            return jsonify({"error": True, "message": "column can not be empty"}), 400
        password = request.json['password']
        query = User.query.filter_by(email=email).first()
        if query:
            return jsonify({"error": True, "message": "email has already been taken, please use another one"}), 400
        else:
            addUser = User(name, email, password)
            db.session.add(addUser)
            db.session.commit()
            return jsonify({"ok": True}), 201
    elif request.method == 'PATCH': # login
        email = request.json['email']
        password = request.json['password']
        query = User.query.filter_by(email=email).first()
        if query is None:
            return jsonify({"error": True, "message": "none exist user"}), 400
        else:
            if query.password == password:
                session['email'] = query.email
                return jsonify({"ok": True}), 201
            else:
                return jsonify({"error": True, "message": "password wrong"}), 400
    elif request.method == 'DELETE': # session invalid
        session.pop('email')
        # session['email'] = False
        return jsonify({"ok": True})
    else: # GET
        sesson = session.get('email')
        if sesson:
            query = User.query.filter_by(email=sesson).first()
            return jsonify({"data": {
                "id": query.id,
                "name": query.name,
                "email": query.email
            }})
        else:
            return jsonify({"message": None})
