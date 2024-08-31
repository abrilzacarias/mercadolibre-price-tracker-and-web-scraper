import scrapy
from app import db, app
from models import Category, Product, PriceHistory
from datetime import datetime
from twisted.internet import reactor
from scrapy.utils.log import configure_logging
import threading
from scrapy.crawler import CrawlerProcess
from twisted.internet.defer import Deferred
from scrapy.utils.project import get_project_settings
from multiprocessing import Process

class MercadoLibreCrawler(scrapy.Spider):
    name = "mercadolibre"
    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "DOWNLOAD_DELAY": 3,  # delay de 3 segundos entre solicitudes
        "RANDOMIZE_DOWNLOAD_DELAY": True,  # aleatorizar el delay
        "CONCURRENT_REQUESTS": 8,  # Ajusta esto según tus necesidades
        "CONCURRENT_REQUESTS_PER_DOMAIN": 4,
    }
    items_count = 0
    base_url = 'https://listado.mercadolibre.com.ar/'
    max_items = 10

    def __init__(self, search_query=None, *args, **kwargs):
        super(MercadoLibreCrawler, self).__init__(*args, **kwargs)
        self.search_query = search_query
        self.product_cache = {}

    def start_requests(self):
        #print(self.search_query)
        clean_url = self.search_query.replace(" ", "-").lower()
        url = self.base_url + clean_url
        yield scrapy.Request(url, self.parse)

    def parse(self, response):
        content = response.css('li.ui-search-layout__item')
        price_histories_to_add = []

        for post in content:
            if self.items_count >= self.max_items:
                break  # Detiene el spider después de 10 items

            name = post.css('h2::text').get()
            price = post.css('span.andes-money-amount__fraction::text').get().replace(".", "").replace(",", ".")
            
            try:
                price = float(price)
            except ValueError:
                price = 0.0

            url = post.css('a::attr(href)').get()
            img_link = post.css('img::attr(data-src)').get() or post.css('img::attr(src)').get()
            
            category_name = self.search_query
            self.items_count += 1

            with app.app_context():
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name, tracked=True)
                    db.session.add(category)
                    db.session.commit()

                if category.tracked:
                    if name not in self.product_cache:
                        product = Product.query.filter_by(name=name).first()
                        self.product_cache[name] = product
                    else:
                        product = self.product_cache[name]

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
                        db.session.add(product)
                        db.session.commit()  # Guarda el producto en la base de datos para obtener su ID

                        self.product_cache[name] = product  # Actualiza la caché con el nuevo producto
                    else:
                        product.price = price  # Actualiza el precio del producto existente

                    # Crear el historial de precios
                    price_history = PriceHistory(
                        product_id=product.id, date=datetime.utcnow(), price=price
                    )
                    price_histories_to_add.append(price_history)

        with app.app_context():
            db.session.add_all(price_histories_to_add)
            db.session.commit()

        if self.items_count < self.max_items:
            next_page = response.css('a.andes-pagination__link[title="Siguiente"]::attr(href)').get()
            if next_page:
                yield scrapy.Request(next_page, self.parse)
        
       
    
    def closed(self, reason):
        self.logger.info(f"Término el scraping. Se extrajeron {self.items_count} items.")
    

def run_spider(search_query):
    process = CrawlerProcess(get_project_settings())
    process.crawl(MercadoLibreCrawler, search_query=search_query)
    process.start()

def scrape_product(search_query):
    p = Process(target=run_spider, args=(search_query,))
    p.start()
    p.join()

if __name__ == "__main__":
    product = input("Ingrese el producto a buscar: ")
    scrape_product(product)
    