from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from tripwebsite.config import config

db = SQLAlchemy()
ma = Marshmallow()



def create_app(config_class):
    app = Flask(__name__)
    app.config.from_object(config[config_class])

    db.init_app(app)
    ma.init_app(app)

# Pages
    @app.route("/")
    def index():
        return render_template("index.html")
    @app.route("/attraction/<id>")
    def attraction(id):
        return render_template("attraction.html")
    @app.route("/booking")
    def booking():
        return render_template("booking.html")
    @app.route("/thankyou")
    def thankyou():
        return render_template("thankyou.html")

    from tripwebsite.attraction.routes import attrs

    app.register_blueprint(attrs)

    return app
