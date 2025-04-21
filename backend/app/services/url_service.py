import time
from datetime import datetime
from typing import List, Optional
from nanoid import generate
from elasticsearch import Elasticsearch
from app.core.config import settings
from app.models.url import URLCreate, URLResponse, URLAnalytics, ClickData, BrowserData, DeviceData, CountryData

class URLService:
    def __init__(self):
        self.es = Elasticsearch([settings.ELASTICSEARCH_URL], api_key=settings.ELASTICSEARCH_API_KEY)
        self._create_indices_if_not_exist()
    
    def _create_indices_if_not_exist(self):
        print("Create required Elasticsearch indices if they don't exist")
        # URLs index
        if not self.es.indices.exists(index="urls"):
            self.es.indices.create(
                index="urls",
                body={
                    "mappings": {
                        "properties": {
                            "original_url": {"type": "keyword"},
                            "short_code": {"type": "keyword"},
                            "created_at": {"type": "date"}
                        }
                    }
                }
            )
        
        # Clicks index
        if not self.es.indices.exists(index="clicks"):
            self.es.indices.create(
                index="clicks",
                body={
                    "mappings": {
                        "properties": {
                            "short_code": {"type": "keyword"},
                            "timestamp": {"type": "date"},
                            "browser": {"type": "keyword"},
                            "device": {"type": "keyword"},
                            "country": {"type": "keyword"},
                            "ip": {"type": "ip"}
                        }
                    }
                }
            )
    
    def create_short_url(self, url_create: URLCreate) -> URLResponse:
        print("Create a shortened URL")
        # Generate a unique short code
        short_code = generate(alphabet=settings.SHORT_URL_ALPHABET, size=settings.SHORT_URL_LENGTH)
        
        # Check if short code already exists (very unlikely but possible)
        while self._short_code_exists(short_code):
            short_code = generate(alphabet=settings.SHORT_URL_ALPHABET, size=settings.SHORT_URL_LENGTH)
        
        # Create timestamp
        created_at = datetime.now(datetime.timezone.utc)

        # Store in Elasticsearch
        self.es.index(
            index="urls",
            id=short_code,
            body={
                "original_url": url_create.original_url,
                "short_code": short_code,
                "created_at": created_at
            },
            refresh=True
        )
        
        # Generate the full short URL
        short_url = f"{settings.FRONTEND_BASE_URL}/{short_code}"
        
        return URLResponse(
            original_url=url_create.original_url,
            short_code=short_code,
            short_url=short_url,
            created_at=created_at
        )
    
    def get_url_by_short_code(self, short_code: str) -> Optional[URLResponse]:
        """Get URL details by short code"""
        try:
            result = self.es.get(index="urls", id=short_code)
            if result["found"]:
                doc = result["_source"]
                short_url = f"{settings.FRONTEND_BASE_URL}/{short_code}"
                
                return URLResponse(
                    original_url=doc["original_url"],
                    short_code=doc["short_code"],
                    short_url=short_url,
                    created_at=doc["created_at"]
                )
            return None
        except:
            return None
    
    def get_recent_urls(self, limit: int = 10) -> List[URLResponse]:
        """Get recent shortened URLs"""
        result = self.es.search(
            index="urls",
            body={
                "query": {"match_all": {}},
                "sort": [{"created_at": {"order": "desc"}}],
                "size": limit
            }
        )
        
        urls = []
        for hit in result["hits"]["hits"]:
            doc = hit["_source"]
            short_code = doc["short_code"]
            short_url = f"{settings.FRONTEND_BASE_URL}/{short_code}"
            
            urls.append(
                URLResponse(
                    original_url=doc["original_url"],
                    short_code=short_code,
                    short_url=short_url,
                    created_at=doc["created_at"]
                )
            )
        
        return urls
    
    def record_click(self, short_code: str, browser: str, device: str, country: str, ip: str):
        """Record a click on a shortened URL"""
        self.es.index(
            index="clicks",
            body={
                "short_code": short_code,
                "timestamp": datetime.utcnow(),
                "browser": browser,
                "device": device,
                "country": country,
                "ip": ip
            },
            refresh=True
        )
    
    def get_url_analytics(self, short_code: str) -> Optional[URLAnalytics]:
        """Get analytics for a URL"""
        # First check if URL exists
        url = self.get_url_by_short_code(short_code)
        if not url:
            return None
        
        # Get total clicks
        total_clicks = self._get_total_clicks(short_code)
        
        # Get clicks by date
        clicks_by_date = self._get_clicks_by_date(short_code)
        
        # Get clicks by browser
        clicks_by_browser = self._get_clicks_by_browser(short_code)
        
        # Get clicks by device
        clicks_by_device = self._get_clicks_by_device(short_code)
        
        # Get clicks by country
        clicks_by_country = self._get_clicks_by_country(short_code)
        
        return URLAnalytics(
            short_code=short_code,
            original_url=url.original_url,
            total_clicks=total_clicks,
            created_at=url.created_at,
            clicks_by_date=clicks_by_date,
            clicks_by_browser=clicks_by_browser,
            clicks_by_device=clicks_by_device,
            clicks_by_country=clicks_by_country
        )
    
    def _short_code_exists(self, short_code: str) -> bool:
        """Check if a short code already exists"""
        try:
            result = self.es.get(index="urls", id=short_code, _source=False)
            return result["found"]
        except:
            return False
    
    def _get_total_clicks(self, short_code: str) -> int:
        """Get total clicks for a URL"""
        result = self.es.count(
            index="clicks",
            body={"query": {"term": {"short_code": short_code}}}
        )
        return result["count"]
    
    def _get_clicks_by_date(self, short_code: str) -> List[ClickData]:
        """Get clicks by date for a URL"""
        result = self.es.search(
            index="clicks",
            body={
                "size": 0,
                "query": {"term": {"short_code": short_code}},
                "aggs": {
                    "clicks_by_date": {
                        "date_histogram": {
                            "field": "timestamp",
                            "calendar_interval": "day",
                            "format": "yyyy-MM-dd"
                        }
                    }
                }
            }
        )
        
        clicks_by_date = []
        for bucket in result["aggregations"]["clicks_by_date"]["buckets"]:
            clicks_by_date.append(
                ClickData(
                    date=bucket["key_as_string"],
                    count=bucket["doc_count"]
                )
            )
        
        return clicks_by_date
    
    def _get_clicks_by_browser(self, short_code: str) -> List[BrowserData]:
        """Get clicks by browser for a URL"""
        result = self.es.search(
            index="clicks",
            body={
                "size": 0,
                "query": {"term": {"short_code": short_code}},
                "aggs": {
                    "clicks_by_browser": {
                        "terms": {"field": "browser", "size": 10}
                    }
                }
            }
        )
        
        clicks_by_browser = []
        for bucket in result["aggregations"]["clicks_by_browser"]["buckets"]:
            clicks_by_browser.append(
                BrowserData(
                    browser=bucket["key"],
                    count=bucket["doc_count"]
                )
            )
        
        return clicks_by_browser
    
    def _get_clicks_by_device(self, short_code: str) -> List[DeviceData]:
        """Get clicks by device for a URL"""
        result = self.es.search(
            index="clicks",
            body={
                "size": 0,
                "query": {"term": {"short_code": short_code}},
                "aggs": {
                    "clicks_by_device": {
                        "terms": {"field": "device", "size": 10}
                    }
                }
            }
        )
        
        clicks_by_device = []
        for bucket in result["aggregations"]["clicks_by_device"]["buckets"]:
            clicks_by_device.append(
                DeviceData(
                    device=bucket["key"],
                    count=bucket["doc_count"]
                )
            )
        
        return clicks_by_device
    
    def _get_clicks_by_country(self, short_code: str) -> List[CountryData]:
        """Get clicks by country for a URL"""
        result = self.es.search(
            index="clicks",
            body={
                "size": 0,
                "query": {"term": {"short_code": short_code}},
                "aggs": {
                    "clicks_by_country": {
                        "terms": {"field": "country", "size": 10}
                    }
                }
            }
        )
        
        clicks_by_country = []
        for bucket in result["aggregations"]["clicks_by_country"]["buckets"]:
            clicks_by_country.append(
                CountryData(
                    country=bucket["key"],
                    count=bucket["doc_count"]
                )
            )
        
        return clicks_by_country

# Create a singleton instance
url_service = URLService()
