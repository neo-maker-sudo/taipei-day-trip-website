import os
import json

# with open('/etc/config.json') as config_file:
#     config = json.load(config_file)

class Config:
    JSON_AS_ASCII = False
    TEMPLATES_AUTO_RELOAD = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://neo:{os.environ.get('NEO_MYSQL')}@localhost:3306/website"

# !Neoneo123
