from flask import Blueprint,request, jsonify, render_template
from tripwebsite import db
from tripwebsite.ma import tripSchema
from tripwebsite.models import Attraction


attrs = Blueprint('attr', __name__)


@attrs.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")

@attrs.route("/api/attractions")
def attractions():
    page = request.args.get('page', None)
    keyword = request.args.get('keyword', None)
    if keyword is None:
        query = Attraction.query.order_by(Attraction.id.asc()).offset(int(page)*12).limit(12)
        output = tripSchema.dump(query)
        if output != []:
            for x in output:
                x['images'] = x['images'].split(",")
            return jsonify({"nextPage": int(page) + 1, "data": output})
        else:
            return jsonify({"error": True, "message": "Server error"}), 500
    elif page is None:
        query_data_page = Attraction.query.filter(Attraction.name.like(f'%%{keyword}%%'))
        keywordOutput = tripSchema.dump(query_data_page)
        return jsonify({"data": keywordOutput})
    else:
        try:
            if page == None:
                return jsonify({"data": "page number error"})
            query_data = Attraction.query.filter(Attraction.name.like(f'%%{keyword}%%')).order_by(Attraction.id.asc()).limit(12)
            TotalOutput = tripSchema.dump(query_data)
            if TotalOutput != []:
                if len(TotalOutput) < 12:
                    for x in TotalOutput:
                        x['images'] = x['images'].split(",")
                    return jsonify({"nextPage": None, "data": TotalOutput})
                else:
                    query_data_check = Attraction.query.filter(Attraction.name.like('%'+keyword+'%')).order_by(Attraction.id.asc()).offset((int(page)+1)*12).limit(12)
                    TotalOutput_check = tripSchema.dump(query_data_check)
                    if TotalOutput_check != []:
                        for x in TotalOutput:
                            x['images'] = x['images'].split(",")
                        return jsonify({"nextPage": int(page) + 1, "data": TotalOutput})
                    else:
                        return jsonify({"nextPage": None, "data": TotalOutput})
            else:
                return jsonify({"nextPage": None, "data": []})
        except:
            return jsonify({"message": "server error"}), 500


@attrs.route("/api/attraction/<int:attractionId>")
def sepefic_search(attractionId):
    data = Attraction.query.filter_by(id=attractionId).first()
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
