from flask import Blueprint,request, jsonify
from tripwebsite import db
from tripwebsite.ma import tripSchema
from tripwebsite.models import Attraction
import json


attrs = Blueprint('attr', __name__)


@attrs.route("/api/attractions")
def attractions():
    page = request.args.get('page', None)
    keyword = request.args.get('keyword', None)
    if keyword is None:
        sql_cmd_keywordNone = f"""
            SELECT * FROM attraction ORDER BY id LIMIT {int(page)*12},12;
        """
        query = db.engine.execute(sql_cmd_keywordNone)
        output = tripSchema.dump(query)
        if output != []:
            for x in output:
                x['images'] = x['images'].split(",")
            return jsonify({"nextPage": int(page) + 1, "data": output})
        else:
            return jsonify({"error": True, "message": "Server error"}), 500
    elif page is None:
        sql_cmd_pageNone = f"""
            SELECT * FROM attraction WHERE name LIKE "%%{keyword}%%"
        """
        query_data_page = db.engine.execute(sql_cmd_pageNone)
        keywordOutput = tripSchema.dump(query_data_page)
        return jsonify({"data": keywordOutput})
    else:
        try:
            if page == None:
                return jsonify({"data": "page number error"})

            sql_cmd = f"""
                SELECT * FROM attraction WHERE name LIKE "%%{keyword}%%" ORDER BY id LIMIT {int(page)*12},12;
            """
            query_data = db.engine.execute(sql_cmd)
            TotalOutput = tripSchema.dump(query_data)
            if TotalOutput != []:
                if len(TotalOutput) < 12:
                    for x in TotalOutput:
                        x['images'] = x['images'].split(",")
                    return jsonify({"nextPage": None, "data": TotalOutput})
                else:
                    sql_cmd_check = f"""
                        SELECT * FROM attraction WHERE name LIKE "%%{keyword}%%" ORDER BY id LIMIT {(int(page)+1)*12},12;
                    """
                    query_data_check = db.engine.execute(sql_cmd_check)
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
