"""
FastAPI wrapper for InstagramPrivSniffer OSINT tool
Provides REST API endpoints for web frontend
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import io
from datetime import datetime
from typing import Optional, List

app = FastAPI(title="InstagramPrivSniffer API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class SearchRequest(BaseModel):
    username: str

class PostDownloadRequest(BaseModel):
    post_url: str

class Post(BaseModel):
    shortcode: str
    post_url: str
    post_owner: str
    is_video: bool
    collaborators: List[str]
    timestamp: str

class SearchResponse(BaseModel):
    account_type: str
    is_private: bool
    posts: List[Post]
    error: Optional[str] = None

# Helper Functions
def get_timestamp():
    return datetime.now().strftime("%H:%M:%S")

def fetch_account_data(username: str) -> dict:
    """Fetch Instagram user profile and collaborative posts"""
    try:
        url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"
        headers = {
            "X-IG-App-ID": "936619743392459",
        }
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=get_error_message(response.status_code)
            )

        user_data = response.json()["data"]["user"]
        return user_data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")

def get_error_message(status_code: int) -> str:
    """Get user-friendly error messages"""
    errors = {
        404: "User not found",
        401: "Rate limited by Instagram. Try again later.",
        403: "Access forbidden",
        500: "Instagram API error"
    }
    return errors.get(status_code, f"Error {status_code}")

def parse_user_data(user_data: dict) -> SearchResponse:
    """Parse Instagram user data into response model"""
    posts = []
    edges = user_data.get("edge_owner_to_timeline_media", {}).get("edges", [])

    for post_item in edges:
        post_data = post_item["node"]
        shortcode = post_data["shortcode"]
        is_video = post_data["is_video"]
        post_owner = post_data["owner"]["username"]

        # Build post URL
        if is_video:
            post_url = f"https://www.instagram.com/{post_owner}/reel/{shortcode}/"
        else:
            post_url = f"https://www.instagram.com/{post_owner}/p/{shortcode}/"

        # Get collaborators
        collaborators = []
        for collab_item in post_data.get("edge_media_to_tagged_user", {}).get("edges", []):
            collab_username = collab_item["node"]["user"]["username"]
            collaborators.append(f"https://www.instagram.com/{collab_username}/")

        posts.append(Post(
            shortcode=shortcode,
            post_url=post_url,
            post_owner=post_owner,
            is_video=is_video,
            collaborators=collaborators,
            timestamp=get_timestamp()
        ))

    account_type = "Private" if user_data.get("is_private") else "Public"

    return SearchResponse(
        account_type=account_type,
        is_private=user_data.get("is_private", False),
        posts=posts
    )

def fetch_media_url(post_url: str) -> tuple[str, bool, str]:
    """Fetch media URL from Instagram post URL
    Returns: (media_url, is_video, filename)
    """
    parts = post_url.split("/")
    
    if len(parts) < 6 or parts[4] not in ("p", "reel"):
        raise HTTPException(status_code=400, detail="Invalid URL format")

    username = parts[3]
    shortcode = parts[5]
    is_video = parts[4] == "reel"
    filename = f"{username}-{'reel' if is_video else 'post'}-{shortcode.replace('-', '')[:10]}"

    try:
        response = requests.get(
            f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}",
            headers={"X-IG-App-ID": "936619743392459"},
            timeout=10
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch media data"
            )

        edges = response.json()["data"]["user"]["edge_owner_to_timeline_media"]["edges"]
        
        for edge in edges:
            node = edge["node"]
            if node["shortcode"] == shortcode:
                media_url = node["video_url"] if node["is_video"] else node["display_url"]
                return media_url, is_video, filename

        raise HTTPException(status_code=404, detail="Post not found")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "InstagramPrivSniffer API is running"}

@app.post("/api/search", response_model=SearchResponse)
async def search_username(request: SearchRequest):
    """Search for Instagram user and get collaborative posts"""
    if not request.username or len(request.username.strip()) == 0:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    user_data = fetch_account_data(request.username.strip())
    return parse_user_data(user_data)

@app.post("/api/download")
async def download_media(request: PostDownloadRequest):
    """Stream media file for download"""
    if not request.post_url:
        raise HTTPException(status_code=400, detail="Post URL is required")

    media_url, is_video, filename = fetch_media_url(request.post_url)

    try:
        response = requests.get(
            media_url,
            headers={"X-IG-App-ID": "936619743392459"},
            timeout=30,
            stream=True
        )

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to download media")

        # Determine file extension
        content_type = response.headers.get("content-type", "")
        if is_video or "video" in content_type:
            ext = ".mp4"
            media_type = "video/mp4"
        else:
            ext = ".jpg"
            media_type = "image/jpeg"

        return StreamingResponse(
            iter(response.iter_content(chunk_size=8192)),
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}{ext}"}
        )

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": get_timestamp()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
