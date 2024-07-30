from app import app, db
from flask import request, jsonify
from models import *
from scraper import scrape_product

# Get products
@app.route("/category", methods=["GET"])
def get_category():
    categories = Category.query.all()

    result = [category.to_json() for category in categories]
    return jsonify(result)

# add/scrape product category
@app.route("/category", methods=["POST"])
def scrape_product_category():
    try:
        data = request.json
        name = data.get("name")
        
        if not name:
            return jsonify({'error': 'No category provided'}), 400

        scrape_product(name)

        return jsonify({
            'msg': 'Product scraping started successfully',
        }), 202
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
