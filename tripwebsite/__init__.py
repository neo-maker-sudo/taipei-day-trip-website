from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from tripwebsite.config import Config

db = SQLAlchemy()
ma = Marshmallow()



def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)
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

    from tripwebsite.attraction.routes import attr

    app.register_blueprint(attr)

    return app
