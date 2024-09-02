from app import db, app
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    tracked = db.Column(db.Boolean, default=True, nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'tracked': self.tracked
        }

class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(500))
    url = db.Column(db.String(3000))
    img = db.Column(db.String(1000))
    price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    source = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship('Category', backref=db.backref('product', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "img": self.img,
            "price": self.price,
            "created_at": self.created_at if self.created_at else None,
            "source": self.source,
            "category_id": self.category_id,
            "category_name": self.category.name if self.category else None
        }
    
class PriceHistory(db.Model):
    __tablename__ = 'price_history'
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    price = db.Column(db.Float, nullable=False)
    product = db.relationship('Product', backref=db.backref('price_history', lazy=True))

    def to_json(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'date': self.date.isoformat(),
            'price': self.price
        }