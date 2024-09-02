# ML Tracking Web Scraper

ML Tracking Web Scraper is a web application built with React and Flask that allows users to manage and track price changes of products from Mercado Libre. It utilizes web scraping techniques to gather product data, stores it in a database, and runs the scraper every 24 hours to monitor price changes. It also provides a user-friendly interface for viewing and managing product prices and categories.

![image](https://github.com/user-attachments/assets/753525b9-a4b2-40e6-90ac-b10755a4b9f3)

![image](https://github.com/user-attachments/assets/52c49f4a-55dd-47b1-8139-134c397800dc)

## Features

- **Web Scraping**: Extracts product information from Mercado Libre.
- **Scheduled Scraping**: Uses GitHub Actions to run the scraper every 24 hours.
- **Category Management**: Add and delete product categories.
- **Price Tracking**: View and track price history of products, and monitor price changes over time.
- **Responsive Interface**: Built with React for a dynamic user experience and Chakra UI for design, including support for both dark and light modes.
- **Database Integration**: Uses PostgreSQL for storing product and price data (note: using PostgreSQL for this project is a bit of overkill, but I wanted to try it).

## Technologies

- **Frontend**: React, Chakra UI, Vite
- **Backend**: Flask
- **Database**: PostgreSQL
- **Hosting**: Render, Neon Tech, Docker
- **Scraping**: Scrapy
- **CI/CD**: Scrapy

## Installation

### Prerequisites

- Python 3.11 or later
- PostgreSQL Database
- Node.js and npm (for React)
- Virtual environment tools (venv)
- pip (Python package manager)

### Frontend Installation

1. Clone the repository:
    ```bash
    git clone <REPOSITORY_URL>
    ```

2. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm start
    ```

### Backend Installation

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Update the database connection settings in config.py with your PostgreSQL database credentials.


5. Run the server:
    ```bash
    flask run
    ```
