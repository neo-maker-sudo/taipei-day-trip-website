from datetime import timedelta
import os
import json

# with open('/etc/config.json') as config_file:
#     config = json.load(config_file)

class Config:
    SECRET_KEY = os.urandom(24)
    PERMENENT_SESSION_LIFETIME = timedelta(days=1)
    JSON_AS_ASCII = False
    TEMPLATES_AUTO_RELOAD = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://neo:{os.getenv('NEO_MYSQL')}@localhost:3306/website"
    DEBUG = True
    ENV = 'development'

