from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_wtf.csrf import CSRFProtect
from tripwebsite.config import Config
from flask_cors import CORS

db = SQLAlchemy()
ma = Marshmallow()
csrf = CSRFProtect()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    ma.init_app(app)
    csrf.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    from tripwebsite.main.routes import main
    from tripwebsite.attraction.routes import attrs
    from tripwebsite.user.routes import users
    from tripwebsite.booking.routes import bookings
    from tripwebsite.order.routes import orders

    app.register_blueprint(main)
    app.register_blueprint(attrs)
    app.register_blueprint(users)
    app.register_blueprint(bookings)
    app.register_blueprint(orders)

    return app
