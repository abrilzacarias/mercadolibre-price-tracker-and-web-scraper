# ML Tracking Web Scraper

ML Tracking Web Scraper is a web application built with React and Flask that allows users to manage product categories, track price changes over time, and visualize price histories. The application provides an intuitive interface for adding and deleting categories, as well as tracking and viewing product price in a chart.

## Features

- **Category Management**: Add and delete product categories.
- **Price Tracking**: View and track price history of products, and monitor price changes over time.
- **Responsive Interface**: Built with React for a dynamic user experience and Chakra UI for design.
- **Deployment on Render**: Configured for deployment on the Render platform.

## Technologies

- **Frontend**: React, Chakra UI, Vite
- **Backend**: Flask
- **Database**: SQLite (or any other database configured on the backend)
- **Scraping**: Scrapy for product data collection
- **Deployment**: Render

## Installation

### Prerequisites

- Node.js (>= 14.x)
- Python (>= 3.8)
- Pip

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

4. Run the server:
    ```bash
    flask run
    ```


