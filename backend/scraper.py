import scrapy
from app import db, app
from models import Category, Product, PriceHistory
from datetime import datetime
from twisted.internet import reactor
from scrapy.utils.log import configure_logging
import threading
from scrapy.crawler import CrawlerRunner


class MercadoLibreCrawler(scrapy.Spider):
    name = "mercadolibre"
    custom_settings = {
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "DOWNLOAD_DELAY": 3,  # delay de 3 segundos entre solicitudes
        "RANDOMIZE_DOWNLOAD_DELAY": True,  # aleatorizar el delay
    }
    download_delay = 1

    def __init__(self, search_query=None, *args, **kwargs):
        super(MercadoLibreCrawler, self).__init__(*args, **kwargs)
        self.search_query = search_query

    def start_requests(self):
        base_url = f"https://listado.mercadolibre.com.ar/{self.search_query}"
        yield scrapy.Request(url=base_url, callback=self.parse_search_results)

    def parse_search_results(self, response):
        products = response.xpath('//li[contains(@class, "ui-search-layout__item")]')

        for product in products[:10]:  # Limitamos a los 10 primeros resultados
            url = product.xpath('.//a[contains(@class, "ui-search-link")]/@href').get()
            if url:
                yield scrapy.Request(url=url, callback=self.parse_product_details)

    def parse_product_details(self, response):
        name = response.xpath('//h1[@class="ui-pdp-title"]/text()').get()
        price = response.xpath(
            '//span[@class="andes-money-amount__fraction"]/text()'
        ).get()
        url = response.url
        category_name = self.search_query

        # Convertir el precio a float
        try:
            price = float(price.replace(".", "").replace(",", "."))
        except (ValueError, AttributeError):
            price = 0.0

        with app.app_context():
            category = Category.query.filter_by(name=category_name).first()
            if not category:
                category = Category(name=category_name, tracked=True)
                db.session.add(category)
                db.session.commit()

            product = Product(
                name=name,
                url=url,
                price=price,
                created_at=datetime.utcnow(),
                category_id=category.id,
                source="MercadoLibre",
            )
            db.session.add(product)
            db.session.commit()

            # Crear el historial de precios
            price_history = PriceHistory(
                product_id=product.id, date=datetime.utcnow().date(), price=price
            )
            db.session.add(price_history)
            db.session.commit()  # Commit al final de la transacción


def start_reactor():
    if not reactor.running:
        reactor.run(installSignalHandlers=False)


def scrape_product(search_query):
    configure_logging()
    runner = CrawlerRunner()
    reactor.callFromThread(runner.crawl, MercadoLibreCrawler, search_query=search_query)


# Inicia el reactor en un hilo separado al importar este módulo
reactor_thread = threading.Thread(target=start_reactor, daemon=True)
reactor_thread.start()


if __name__ == "__main__":
    product = input("Ingrese el producto a buscar: ")
    scrape_product(product)
