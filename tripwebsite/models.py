from tripwebsite import db
from datetime import datetime
import math

relations = db.Table('relations',
                    db.Column('user_id', db.Integer,db.ForeignKey('user.id')),
                    db.Column('booking_id', db.Integer,db.ForeignKey('booking.id'))
                    )

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
    bookings = db.relationship('Booking', backref='attraction', lazy=True)

    def __repr__(self):
        return f"Attraction('{self.id}','{self.name}', '{self.category}', '{self.description}', '{self.address}', '{self.transport}', '{self.mrt}', '{self.latitude}', '{self.longitude}', '{self.images}')"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    bookings = db.relationship('Booking', secondary=relations, lazy='subquery', backref=db.backref('user', lazy='dynamic'))

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    attraction_id = db.Column(
        db.Integer, 
        db.ForeignKey('attraction.id'),
        nullable=False
    )
    orders = db.relationship('Order', backref='orderBooking', lazy=True)

    def __repr__(self):
        return f'Booking({self.date}, {self.time}, {self.price})'

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(255))
    price = db.Column(db.Integer)
    status = db.Column(db.Integer)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'), nullable=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'), nullable=True)

    def __repr__(self):
        return f'Order({self.number}, {self.status}, {self.price})'

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    orders = db.relationship('Order', backref='orderContact', lazy=True)

    def __init__(self, name, email, phone):
        self.name = name
        self.email = email
        self.phone = phone

    def __repr__(self):
        return f'Contact({self.name}, {self.email}, {self.phone})'
