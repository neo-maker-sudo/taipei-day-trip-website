from flask_sqlalchemy import SQLAlchemy
from flask import Flask
import json
import math
import re
import os
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://neo:{os.environ.get('NEO_MYSQL')}@localhost:3306/website"
# !Neoneo123
db = SQLAlchemy()

class Attraction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    transport = db.Column(db.Text)
    mrt = db.Column(db.String(255))
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    images = db.Column(db.Text, nullable=False)


    def __repr__(self):
        return f"Attraction('{self.name}', '{self.category}', '{self.description}', '{self.address}', '{self.transport}', '{self.mrt}', '{self.latitude}', '{self.longitude}', '{self.images}')"

def test():
    with open("taipei-attractions.json", mode='r', encoding="utf-8") as file:
        result = json.load(file)
    finalData = result["result"]["results"]

    for result in finalData:
        name = result["stitle"]
        category = result["CAT2"]
        description = result['xbody']
        address = result['address']
        transport = result['info']
        mrt = result['MRT']
        latitude = result['latitude']
        longitude = result["longitude"]
        result = ",".join(result["file"].replace("http", " http").split(' ')[1:])
        match = re.findall(r'http.*jpg|http.*png', result, re.I)
        images = ",".join(match)

        trip = Attraction(name=name, category=category, description=description, address=address, transport=transport, mrt=mrt, latitude=latitude, longitude=longitude, images=images)
        db.session.add(trip)
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.init_app(app)
        db.create_all()
        test()
    app.run(port=5000)
