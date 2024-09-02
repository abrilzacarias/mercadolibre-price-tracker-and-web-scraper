from app import app, db
from flask import request, jsonify
from models import *

from twisted.internet import reactor
from twisted.internet.threads import blockingCallFromThread
from sqlalchemy.exc import SQLAlchemyError
import time
# Get categories
@app.route("/category", methods=["GET"])
def get_category():
    categories = Category.query.all()

    result = [category.to_json() for category in categories]
    return jsonify(result)

# add/scrape product category
@app.route("/category", methods=["POST"])
def scrape_product_category():
    from scraper import scrape_product
    try:
        input_data = request.json.get('name')
        
        if not input_data:
            return jsonify({'error': 'No category provided'}), 400

        scrape_product(input_data)

        try:
            # Obtener la última categoría añadida
            last_category = Category.query.order_by(Category.id.desc()).first()

            if last_category.name == input_data:
                return jsonify({
                    'id': last_category.id,
                    'name': last_category.name,
                    'tracked': last_category.tracked
                }), 201

            return jsonify({'error': 'An error occurred'}), 409

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return jsonify({"error": f"Error in database: {str(e)}"}), 500


    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
#delete product category
@app.route('/category/<int:id>', methods=['DELETE'])
def delete_product_category(id):
    try:
        category = Category.query.get(id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        # Borrar los registros en price_history relacionados con los productos de la categoría
        products = Product.query.filter_by(category_id=id).all()
        for product in products:
            PriceHistory.query.filter_by(product_id=product.id).delete()

        # Borrar los productos relacionados con la categoría
        Product.query.filter_by(category_id=id).delete()

        # Borrar la categoría
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': "Category deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get price for price table
@app.route("/pricehistory/<int:category_id>", methods=["GET"])
def get_price_history_by_category(category_id):
    products = Product.query.filter_by(category_id=category_id).all()

    if not products:
        return jsonify({"error": "No products found for this category"}), 404

    result = []
    for product in products:
        # Get the latest price record for the product
        latest_price = PriceHistory.query.filter_by(product_id=product.id).order_by(PriceHistory.date.desc()).first()
        
        # Calculate price change percentage if there are previous records
        previous_prices = PriceHistory.query.filter_by(product_id=product.id).order_by(PriceHistory.date.desc()).all()

        if len(previous_prices) > 1:
            price_change = ((latest_price.price - previous_prices[1].price) / previous_prices[1].price) * 100
        else:
            price_change = 0

        result.append({
            "id": product.id,
            "product_name": product.name,
            "actual_price": latest_price.price,
            "price_change": price_change,
            "date": latest_price.date
        })
    #print(result)
    return jsonify(result)

#get product details
@app.route("/product/<int:id>", methods=["GET"])
def get_details(id):
    product = Product.query.filter_by(id=id).first()

    if not product:
        return jsonify({"error": "No products found for this id"}), 404

    result = product.to_json()

    return jsonify(result)

#update tracked category
@app.route("/tracked-category/<int:id>", methods=["PUT"])
def update_tracked_category(id):
    category = Category.query.filter_by(id=id).first()

    if not category:
        return jsonify({"error": "No category found for this id"}), 404

    category.tracked = not category.tracked
    db.session.commit()  

    return jsonify({"id": category.id, "tracked": category.tracked, "name": category.name})

# Get price history for price chart
@app.route("/chart_price_history/<int:product_id>", methods=["GET"])
def get_chart_price_history(product_id):
    try:
        # Obtener el historial de precios del producto
        price_history = PriceHistory.query.filter_by(product_id=product_id).order_by(PriceHistory.date).all()
        
        data = [ph.to_json() for ph in price_history]
        
        return jsonify(data)
    except SQLAlchemyError as e:
        return jsonify({"error": f"Error in database: {str(e)}"}), 500