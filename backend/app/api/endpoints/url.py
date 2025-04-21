from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from app.models.url import URLCreate, URLResponse, URLAnalytics
from app.services.url_service import url_service
from app.utils.user_agent_parser import parse_user_agent

router = APIRouter()

@router.post("/shorten", response_model=URLResponse)
async def create_short_url(url_create: URLCreate):
    """
    Create a shortened URL from a long URL
    """
    return url_service.create_short_url(url_create)

@router.get("/recent", response_model=List[URLResponse])
async def get_recent_urls():
    """
    Get a list of recently created shortened URLs
    """
    return url_service.get_recent_urls(limit=10)

@router.get("/analytics/{short_code}", response_model=URLAnalytics)
async def get_url_analytics(short_code: str):
    """
    Get analytics for a specific shortened URL
    """
    analytics = url_service.get_url_analytics(short_code)
    if not analytics:
        raise HTTPException(status_code=404, detail="URL not found")
    return analytics

@router.get("/{short_code}")
async def redirect_to_url(short_code: str, request: Request):
    """
    Redirect to the original URL and record click data
    """
    url = url_service.get_url_by_short_code(short_code)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    
    # Parse user agent
    user_agent = request.headers.get("user-agent", "")
    browser, device = parse_user_agent(user_agent)
    
    # Get client IP
    client_ip = request.client.host if request.client else "0.0.0.0"
    
    # Record click (use a default country for now, in a real app you'd use IP geolocation)
    url_service.record_click(
        short_code=short_code,
        browser=browser,
        device=device,
        country="Unknown",  # In a real app, determine this from IP
        ip=client_ip
    )
    
    # Return the original URL for redirection
    return {"url": url.original_url}
