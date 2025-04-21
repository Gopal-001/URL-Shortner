from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import os
import json
from datetime import datetime
from nanoid import generate
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Configuration
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
SHORT_URL_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
SHORT_URL_LENGTH = 6

# In-memory storage (replace with Elasticsearch in production)
urls_db = {}
clicks_db = []

# Helper functions
def get_short_url(short_code):
    return f"{FRONTEND_BASE_URL}/{short_code}"

def create_short_url(original_url):
    # Generate a unique short code
    short_code = generate(alphabet=SHORT_URL_ALPHABET, size=SHORT_URL_LENGTH)

    # Check if short code already exists (very unlikely but possible)
    while short_code in urls_db:
        short_code = generate(alphabet=SHORT_URL_ALPHABET, size=SHORT_URL_LENGTH)

    # Store URL
    created_at = datetime.utcnow().isoformat()
    urls_db[short_code] = {
        "original_url": original_url,
        "short_code": short_code,
        "created_at": created_at
    }

    # Return response
    return {
        "original_url": original_url,
        "short_code": short_code,
        "short_url": get_short_url(short_code),
        "created_at": created_at
    }

def record_click(short_code, user_agent, ip):
    # Parse user agent (simplified)
    browser = "Unknown"
    if "Firefox" in user_agent:
        browser = "Firefox"
    elif "Chrome" in user_agent and "Edg" not in user_agent:
        browser = "Chrome"
    elif "Safari" in user_agent and "Chrome" not in user_agent:
        browser = "Safari"
    elif "Edg" in user_agent:
        browser = "Edge"

    device = "Desktop"
    if any(m in user_agent for m in ["Android", "iPhone", "Mobile"]):
        device = "Mobile"
    elif "iPad" in user_agent:
        device = "Tablet"

    # Record click
    clicks_db.append({
        "short_code": short_code,
        "timestamp": datetime.utcnow().isoformat(),
        "browser": browser,
        "device": device,
        "country": "Unknown",
        "ip": ip
    })

def get_url_analytics(short_code):
    if short_code not in urls_db:
        return None

    # Get URL data
    url_data = urls_db[short_code]

    # Filter clicks for this short code
    url_clicks = [click for click in clicks_db if click["short_code"] == short_code]
    total_clicks = len(url_clicks)

    # Aggregate by date (simplified)
    clicks_by_date = {}
    for click in url_clicks:
        date = click["timestamp"].split("T")[0]
        clicks_by_date[date] = clicks_by_date.get(date, 0) + 1

    # Aggregate by browser
    clicks_by_browser = {}
    for click in url_clicks:
        browser = click["browser"]
        clicks_by_browser[browser] = clicks_by_browser.get(browser, 0) + 1

    # Aggregate by device
    clicks_by_device = {}
    for click in url_clicks:
        device = click["device"]
        clicks_by_device[device] = clicks_by_device.get(device, 0) + 1

    # Aggregate by country
    clicks_by_country = {}
    for click in url_clicks:
        country = click["country"]
        clicks_by_country[country] = clicks_by_country.get(country, 0) + 1

    # Format response
    return {
        "short_code": short_code,
        "original_url": url_data["original_url"],
        "total_clicks": total_clicks,
        "created_at": url_data["created_at"],
        "clicks_by_date": [{"date": date, "count": count} for date, count in clicks_by_date.items()],
        "clicks_by_browser": [{"browser": browser, "count": count} for browser, count in clicks_by_browser.items()],
        "clicks_by_device": [{"device": device, "count": count} for device, count in clicks_by_device.items()],
        "clicks_by_country": [{"country": country, "count": count} for country, count in clicks_by_country.items()]
    }

# API Routes
@app.route('/api/shorten', methods=['POST'])
def shorten_url():
    data = request.json
    if not data or 'original_url' not in data:
        return jsonify({"error": "Missing original_url parameter"}), 400

    return jsonify(create_short_url(data['original_url']))

@app.route('/api/recent', methods=['GET'])
def get_recent_urls():
    # Get most recent URLs (up to 10)
    recent = list(urls_db.values())
    recent.sort(key=lambda x: x["created_at"], reverse=True)
    recent = recent[:10]

    # Format response
    result = []
    for url in recent:
        result.append({
            "original_url": url["original_url"],
            "short_code": url["short_code"],
            "short_url": get_short_url(url["short_code"]),
            "created_at": url["created_at"]
        })

    return jsonify(result)

@app.route('/api/analytics/<short_code>', methods=['GET'])
def get_analytics(short_code):
    analytics = get_url_analytics(short_code)
    if not analytics:
        return jsonify({"error": "URL not found"}), 404

    return jsonify(analytics)

@app.route('/<short_code>', methods=['GET'])
def redirect_to_url(short_code):
    if short_code not in urls_db:
        return "URL not found", 404

    # Record click
    user_agent = request.headers.get("User-Agent", "")
    ip = request.remote_addr
    record_click(short_code, user_agent, ip)

    # Redirect to original URL
    return redirect(urls_db[short_code]["original_url"])

@app.route('/', methods=['GET'])
def home():
    return "URL Shortener API is running. Use /api/shorten to create a short URL."

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
