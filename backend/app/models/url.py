from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, HttpUrl

class URLBase(BaseModel):
    original_url: str

class URLCreate(URLBase):
    pass

class URLResponse(URLBase):
    short_code: str
    short_url: str
    created_at: datetime

    class Config:
        orm_mode = True

class ClickData(BaseModel):
    date: str
    count: int

class BrowserData(BaseModel):
    browser: str
    count: int

class DeviceData(BaseModel):
    device: str
    count: int

class CountryData(BaseModel):
    country: str
    count: int

class URLAnalytics(BaseModel):
    short_code: str
    original_url: str
    total_clicks: int
    created_at: datetime
    clicks_by_date: List[ClickData]
    clicks_by_browser: List[BrowserData]
    clicks_by_device: List[DeviceData]
    clicks_by_country: List[CountryData]

    class Config:
        orm_mode = True
