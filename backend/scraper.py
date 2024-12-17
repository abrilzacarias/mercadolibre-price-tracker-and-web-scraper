import asyncio
import logging
from datetime import datetime
from app import db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from models import Category, Product, PriceHistory
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

class MercadoLibreScraper:
    def __init__(self, search_query, max_items=10):
        self.search_query = search_query
        self.base_url = "https://listado.mercadolibre.com.ar/"
        self.max_items = max_items
        self.items_count = 0

    async def scrape(self):
        try:
            async with async_playwright() as p:
                logger.info("Iniciando Playwright y el navegador.")
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                await self.process_page(page)
                await browser.close()
                logger.info("Navegador cerrado.")
        except Exception as e:
            logger.error(f"Error al iniciar Playwright o el navegador: {e}", exc_info=True)
            raise

    async def process_page(self, page, url=None):
        try:
            if url is None:
                clean_url = self.search_query.replace(" ", "-").lower()
                url = self.base_url + clean_url

            logger.info(f"Navegando a la URL: {url}")
            await page.goto(url, timeout=60000)
            await page.wait_for_selector("li.ui-search-layout__item", timeout=30000)
            logger.info("Selector encontrado. Procesando contenido de la página.")

            content = await page.query_selector_all("li.ui-search-layout__item")
            price_histories_to_add = []

            for post in content:
                if self.items_count >= self.max_items:
                    logger.info("Número máximo de ítems alcanzado.")
                    break

                name_element = await post.query_selector("h2")
                name = await name_element.evaluate("el => el.textContent") if name_element else None
                price_text = await post.query_selector("span.andes-money-amount__fraction")
                price = await price_text.evaluate("el => el.textContent") if price_text else "0.0"
                url_element = await post.query_selector("a")
                url = await url_element.evaluate("el => el.href") if url_element else None
                img_element = await post.query_selector("img")
                img_link = await img_element.evaluate("el => el.dataset.src || el.src") if img_element else None

                try:
                    price = float(price.replace(".", "").replace(",", ".")) if price else 0.0
                except ValueError:
                    price = 0.0
                    logger.warning(f"No se pudo convertir el precio: {price_text}")

                category_name = self.search_query
                self.items_count += 1

                try:
                    category = Category.query.filter_by(name=category_name).first()
                    if not category:
                        category = Category(name=category_name, tracked=True)
                        db.session.add(category)
                        db.session.commit()
                        logger.info(f"Categoría creada: {category_name}")

                    if category.tracked:
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
                            db.session.add(product)
                            logger.info(f"Producto agregado: {name}")
                        else:
                            product.price = price
                            logger.info(f"Producto actualizado: {name}")
                        db.session.commit()

                        price_history = PriceHistory(
                            product_id=product.id,
                            date=datetime.utcnow(),
                            price=price,
                        )
                        price_histories_to_add.append(price_history)

                except SQLAlchemyError as e:
                    logger.error(f"Error en la base de datos: {e}", exc_info=True)
                    db.session.rollback()
                    raise

            if price_histories_to_add:
                db.session.add_all(price_histories_to_add)
                db.session.commit()
                logger.info("Historial de precios añadido.")

            # Manejar la paginación
            if self.items_count < self.max_items:
                try:
                    next_page = await page.eval_on_selector('a.andes-pagination__link[title="Siguiente"]', "el => el.href")
                    if next_page:
                        logger.info(f"Paginando a la siguiente URL: {next_page}")
                        await self.process_page(page, url=next_page)
                except Exception as e:
                    logger.warning(f"No hay más páginas disponibles o error en la paginación: {e}")

        except Exception as e:
            logger.error(f"Error al procesar la página: {e}", exc_info=True)
            raise

async def scrape_product(search_query: str):
    logger.info(f"Iniciando scrapeo para la búsqueda: {search_query}")
    try:
        scraper = MercadoLibreScraper(search_query)
        await scraper.scrape()
        logger.info(f"Scrapeo finalizado para la búsqueda: {search_query}")
    except Exception as e:
        logger.error(f"Error en el scraping: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    query = input("Ingrese la categoría a buscar: ")
    try:
        asyncio.run(scrape_product(query))
    except Exception as e:
        logger.critical(f"Error crítico al ejecutar el script principal: {e}", exc_info=True)
