from flask import Blueprint, render_template, request, jsonify, session
from tripwebsite.models import Booking, User, Attraction
from tripwebsite import db

bookings = Blueprint('bookings', __name__)

@bookings.route("/booking")
def booking():
    return render_template("booking.html")

@bookings.route("/api/booking", methods=['GET', 'POST', 'DELETE'])
def apiBooking():
    if request.method == 'DELETE':
        sess = session.get('email')
        if sess:
            currUser = User.query.filter_by(email=sess).first()
            checkExist = Booking.query.filter(
                Booking.user.any(email=currUser.email)).first()
            if checkExist:
                db.session.delete(checkExist)
                db.session.commit()
                return jsonify({"ok": True})
            else:
                return jsonify({"error": True, "message": "you do not have any booking information to deleting"}), 400
        else:
            return jsonify({"error": True, "message": "you are not allow to do this action"}), 403
    elif request.method == 'POST':  # ADDING
        sess = session.get('email')
        if sess:
            attractionId = request.json['attractionId']
            date = request.json['date']
            time = request.json['time']
            price = request.json['price']
            try:
                currUser = User.query.filter_by(email=sess).first()
                attraction = Attraction.query.filter_by(
                    id=attractionId).first()
                if attraction is None:
                    return jsonify({"error": True, "message": "attraction id isn't exist"}), 400
                # 確認同一使用者是否有重複預定同一景點同一天的情況
                queryExist = Booking.query.filter(Booking.user.any(email=currUser.email)).first()
                if queryExist:
                    return jsonify({"error": True, "message": "same user booking double time"}), 400
                else:
                    booking = Booking(date=date, time=time,price=price, attraction=attraction)
                    currUser.bookings.append(booking)  # <= 新增中繼表資料

                    if booking:
                        db.session.add(currUser)
                        db.session.commit()
                        return jsonify({"ok": True})
                    else:
                        raise Exception()
            except Exception:
                return jsonify({"error": True, "message": "establish booking error"}), 400
            except:
                return jsonify({"error": True, "message": "server error"}), 500
        else:
            return jsonify({"error": True, "message": "you are not allow to do this action"}), 403
    else:  # GET
        sess = session.get('email')
        if sess:
            currUser = User.query.filter_by(email=sess).first()
            bookingData = Booking.query.filter(
                Booking.user.any(email=currUser.email)).first()
            if bookingData:
                return jsonify({"data": {
                    "attraction": {
                        "id": bookingData.attraction.id,
                        "name": bookingData.attraction.name,
                        "address": bookingData.attraction.address,
                        "image": bookingData.attraction.images
                    },
                    "date": bookingData.date,
                    "time": bookingData.time,
                    "price": bookingData.price
                }})
            else:
                return jsonify({"error": True, "message": "you do not have any booking information"}), 400
        else:
            return jsonify({"error": True, "message": "you are not allow to do this action"}), 403
