from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import math
import json

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://neo:!Neoneo123@localhost:3306/website"

db = SQLAlchemy()
ma = Marshmallow()

i = 0
def mydefault():
    global i
    if i < 12:
        n = 0

    i += 1
    if i != 0 and i % 12 == 0:
        n = i / 12
        result = math.floor(n)

    n = i / 12
    result = math.floor(n)
    return

class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    transport = db.Column(db.Text)
    mrt = db.Column(db.String(255))
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    images = db.Column(db.String(255), nullable=False)
    page = db.Column(db.Integer, primary_key=False, default=mydefault)

    def __repr__(self):
        return f"Trip('{self.id}','{self.name}', '{self.category}', '{self.description}', '{self.address}', '{self.transport}', '{self.mrt}', '{self.latitude}', '{self.longitude}', '{self.images}', '{self.page}')"

class TripSchema(ma.Schema):
	class Meta:
		fields = ('id', 'name', 'category', 'description', 'address', 'transport', 'mrt', 'latitude', 'longitude', 'images')
		

# init Schema
tripSchema = TripSchema(many=True)

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

@app.route("/api/attractions")
def attractions():
    page = request.args.get('page', None)
    keyword = request.args.get('keyword', None)
    if keyword is None:
        data = Trip.query.filter_by(page=page).all()
        if data:
            output = tripSchema.dump(data)
            return jsonify({"nextPage": int(page) + 1, "data": output})
        else:
            return jsonify({"error": True, "message": "Server error"}), 500
    elif page is None:
        sql_cmd_pageNone = f"""
            SELECT * FROM trip WHERE name LIKE "%%{keyword}%%"
        """
        query_data_page = db.engine.execute(sql_cmd_pageNone)
        keywordOutput = tripSchema.dump(query_data_page)
        return jsonify({"data": keywordOutput})
    else:
        sql_cmd = f"""
            SELECT * FROM trip WHERE name LIKE "%%{keyword}%%" AND page={page}
        """
        query_data = db.engine.execute(sql_cmd)
        TotalOutput = tripSchema.dump(query_data)
        if TotalOutput != []:
            return jsonify({"nextPage": None, "data": []})
        else:
            sql_cmd_keywordError = f"""
                SELECT * FROM trip WHERE page={page}
            """
            query_page_output = db.engine.execute(sql_cmd_keywordError)
            onlyPageOutput = tripSchema.dump(query_page_output)
            return jsonify({"nextPage": int(page) + 1, "data": onlyPageOutput})

@app.route("/api/attraction/<int:attractionId>")
def sepefic_search(attractionId):
    data = Trip.query.filter_by(id=attractionId).first()
    if data:
        return jsonify({"data": {
            "id": data.id,
            "name": data.name,
            "category": data.category,
            "description": data.description,
            "address": data.address,
            "transport": data.transport,
            "mrt": data.mrt,
            "latitude": data.latitude,
            "longitude": data.longitude,
            "image": [
                data.images
            ]
        }})
    elif data is None:
        return jsonify({"error": True, "message": "Wrong attraction id"}), 400
    else:
        return jsonify({"error": True, "message": "Server error"}), 500

if __name__ == '__main__':
	with app.app_context():
		db.init_app(app)
	app.run(host="0.0.0.0", port=3000)

    
