import requests
import json
from flask import Blueprint, session, jsonify, request, redirect, url_for
from tripwebsite.models import Order, User, Contact, Booking, Attraction
from tripwebsite import db

orders = Blueprint('orders', __name__)


@orders.route('/api/orders', methods=['POST'])
def order():
    sess = session.get('email')
    if sess:
        prime = request.json["prime"]
        orderData = request.json['order']
        contactName = orderData['contact']['name']
        contactEmail = orderData['contact']['email']
        contactPhone = orderData['contact']['phone']

        booking = Booking.query.filter_by(
            attraction_id=orderData['trip']['attraction']['id']).first()
        contact = Contact(contactName, contactEmail, contactPhone)
        if contact:
            db.session.add(contact)
            db.session.commit()
        else:
            return jsonify({"error": True, "message": "contact information error"}), 400

        order = Order(number=prime, price=orderData['price'],status='0', orderBooking=booking, orderContact=contact)
        try:
            if order:
                db.session.add(order)
                db.session.commit()
            else:
                raise Exception()
        except Exception:
            return jsonify({"error": True, "message": "establish order error"}), 400
        except:
            return jsonify({"error": True, "message": "server error"}), 500

        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        headers = {
            "Content-Type": "application/json",
            "x-api-key": "partner_Edfk54LpI10kb1Ho5aRh6bLAlMVIUPa2o2OcX5zfzwusFxLzAxBwHBYn"
        }
        primeData = {
            "prime": "test_3a2fb2b7e892b914a03c95dd4dd5dc7970c908df67a49527c0a648b2bc9",
            "partner_key": "partner_Edfk54LpI10kb1Ho5aRh6bLAlMVIUPa2o2OcX5zfzwusFxLzAxBwHBYn",
            "merchant_id": "eyywqkgb_CTBC",
            "details": "Tappay test",
            "amount": orderData['price'],
            "cardholder": {
                "name": contactName,
                "email": contactEmail,
                "national_id": "A123456789",
                "phone_number": contactPhone  # 測試電話 0912345678
            }
        }
        result = requests.post(
            url, data=json.dumps(primeData), headers=headers)
        rawData = result.json()

        if rawData['status'] == 0:
            query = Order.query.filter_by(number=prime).first()
            if query:
                query.status = 1
                db.session.commit()
                return jsonify({"data": {
                    "number": order.number,
                    "payment": {
                        "status": rawData['status'],
                        "message": "付款成功"
                    }
                }})
            else:
                return jsonify({"error": True, "message": "update status order error"}), 400
        else:
            return jsonify({"error": True, "number": order.number, "message": rawData["msg"]}), 400
    else:
        return jsonify({"error": True, "message": "you are not allow to do this action"}), 403

@orders.route('/api/order/<string:orderNumber>')
def orderNumber(orderNumber):
    sess = session.get('email')
    if sess:
        if orderNumber:
            currUser = User.query.filter_by(email=sess).first()
            contactData = Contact.query.filter_by(email=currUser.email).first()
            bookingData = Booking.query.filter(
                Booking.user.any(email=currUser.email)).first()
            if bookingData:
                attractionData = Attraction.query.filter_by(
                    id=bookingData.attraction_id).first()
                order = Order.query.filter_by(number=orderNumber).first()
                return jsonify({"data": {
                    "number": order.number,
                    "price": order.price,
                    "trip": {
                        "attraction": {
                            "id": attractionData.id,
                            "name": attractionData.name,
                            "address": attractionData.address,
                            "images": attractionData.images
                        },
                        "date": bookingData.date,
                        "time": bookingData.time
                    },
                    "contact": {
                        "name": contactData.name,
                        "email": contactData.email,
                        "phone": contactData.phone
                    },
                    "status": 1
                }})
            else:
                return jsonify({"error": True, "status": "failed", "message": None})
        else:
            return redirect(url_for('main.index'))
    else:
        return jsonify({"error": True, "message": "you are not allow to do this action"}), 403
