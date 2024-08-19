import scrapy
from app import db, app
from models import Category, Product, PriceHistory
from datetime import datetime
from twisted.internet import reactor
from scrapy.utils.log import configure_logging
import threading
from scrapy.crawler import CrawlerRunner
from twisted.internet.defer import Deferred

class MercadoLibreCrawler(scrapy.Spider):
    name = "mercadolibre"
    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "DOWNLOAD_DELAY": 3,  # delay de 3 segundos entre solicitudes
        "RANDOMIZE_DOWNLOAD_DELAY": True,  # aleatorizar el delay
    }
    items_count = 0
    base_url = 'https://listado.mercadolibre.com.ar/'
    max_items = 10

    def __init__(self, search_query=None, *args, **kwargs):
        super(MercadoLibreCrawler, self).__init__(*args, **kwargs)
        self.search_query = search_query

    def start_requests(self):
        #print(self.search_query)
        clean_url = self.search_query.replace(" ", "-").lower()
        url = self.base_url + clean_url
        yield scrapy.Request(url, self.parse)

    def parse(self, response):
        content = response.css('li.ui-search-layout__item')
        products_to_commit = []
        price_histories_to_commit = []

        for post in content:
            if self.items_count >= self.max_items:
                return  # Stop the spider after reaching the maximum number of items

            name = post.css('h2::text').get()
            price = post.css('span.andes-money-amount__fraction::text').get()
            try:
                price = float(price.replace(".", "").replace(",", "."))
            except (ValueError, AttributeError):
                price = 0.0

            url = post.css('a::attr(href)').get()
            img_link = post.css('img::attr(data-src)').get()
            if not img_link:
                img_link = post.css('img::attr(src)').get()
            category_name = self.search_query
            self.items_count += 1

            # Access the database session
            with app.app_context():
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name, tracked=True)
                    db.session.add(category)
                    db.session.flush()  # Ensure category is added and its ID is available
                
                product = Product.query.filter_by(name=name).first()
                if not product:
                    product = Product(
                        name=name,
                        url=url,
                        img=img_link,
                        price=price,
                        created_at=datetime.utcnow(),
                        category_id=category.id,
                        source="MercadoLibre",
                    )
                    products_to_commit.append(product)
                else:
                    product.price = price  # Update the existing product's price
                    products_to_commit.append(product)  # Ensure to update existing products as well
                
                if category.tracked:
                    price_history = PriceHistory(
                        product_id=product.id,
                        date=datetime.utcnow(),
                        price=price
                    )
                    price_histories_to_commit.append(price_history)

        # Commit all product changes and price histories
        with app.app_context():
            db.session.add_all(products_to_commit)
            db.session.add_all(price_histories_to_commit)
            db.session.commit()

    def closed(self, reason):
        self.logger.info(f"Término el scraping. Se extrajeron {self.items_count} items.")
    

def start_reactor():
    if not reactor.running:
        reactor.run(installSignalHandlers=False)

def scrape_product(search_query):
    configure_logging()
    runner = CrawlerRunner()
    #Deferred es una clase para manejar operaciones asincrónicas.
    d = runner.crawl(MercadoLibreCrawler, search_query=search_query)
    if not isinstance(d, Deferred):
        d = Deferred()
        d.callback(None)
    return d

# Inicia el reactor en un hilo separado al importar este módulo
reactor_thread = threading.Thread(target=start_reactor, daemon=True)
reactor_thread.start()

if __name__ == "__main__":
    product = input("Ingrese el producto a buscar: ")
    scrape_product(product)
    