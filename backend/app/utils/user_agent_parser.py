import re
from typing import Tuple

def parse_user_agent(user_agent: str) -> Tuple[str, str]:
    """
    Parse user agent string to extract browser and device information
    
    Args:
        user_agent: The user agent string from the request
        
    Returns:
        Tuple containing (browser, device)
    """
    # Browser detection
    browser = "Unknown"
    if "Firefox" in user_agent:
        browser = "Firefox"
    elif "Chrome" in user_agent and "Edg" not in user_agent and "OPR" not in user_agent:
        browser = "Chrome"
    elif "Safari" in user_agent and "Chrome" not in user_agent:
        browser = "Safari"
    elif "Edg" in user_agent:
        browser = "Edge"
    elif "OPR" in user_agent or "Opera" in user_agent:
        browser = "Opera"
    elif "MSIE" in user_agent or "Trident" in user_agent:
        browser = "Internet Explorer"
    
    # Device detection
    device = "Desktop"
    mobile_patterns = [
        "Android", "iPhone", "iPad", "iPod", "Windows Phone", 
        "BlackBerry", "Mobile", "Tablet"
    ]
    
    for pattern in mobile_patterns:
        if pattern in user_agent:
            if pattern in ["iPad", "Tablet"]:
                device = "Tablet"
            else:
                device = "Mobile"
            break
    
    return browser, device
