# InstagramPrivSniffer Web Interface

A modern web interface for the InstagramPrivSniffer OSINT tool, built with Next.js (frontend) and FastAPI (backend).

## Features

✨ **Modern UI** - Dark-themed, responsive design optimized for mobile and desktop
🔍 **Username Search** - Search private Instagram accounts for collaborative posts
📸 **Media Preview** - View images and videos directly in the browser
💾 **Client-Side Downloads** - Download media directly without server storage
⏱️ **Search History** - Keep track of recent searches in local storage
🚀 **Real-Time Results** - Instant feedback while searching

## Architecture

### Frontend (Next.js 16)
- **Location**: `/web` directory
- **Tech Stack**: React 19, TypeScript, Tailwind CSS
- **Components**:
  - `SearchForm` - Username input and search button
  - `ResultsGrid` - Grid display of found posts
  - `MediaViewer` - Modal for viewing and downloading media
  - `SearchHistory` - Sidebar with recent searches
- **State Management**: Custom React hooks (`useSearch`, `useSearchHistory`, `useDownload`)
- **Storage**: Browser localStorage for search history

### Backend (FastAPI)
- **Location**: `/api_server.py`
- **Tech Stack**: Python 3.10+, FastAPI, Uvicorn
- **Features**:
  - CORS middleware for cross-origin requests
  - REST API endpoints for search and download
  - Streaming file downloads
  - Error handling with user-friendly messages

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm/yarn/pnpm

### Setup

1. **Install Python dependencies**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install fastapi uvicorn python-multipart aiofiles
```

2. **Install frontend dependencies**:
```bash
cd web
npm install
cd ..
```

## Running the Application

### Option 1: Using the startup script (Linux/macOS)
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual startup

**Terminal 1 - Start FastAPI backend**:
```bash
source venv/bin/activate  # Activate virtual environment
python api_server.py
```
Backend runs on: `http://localhost:8000`

**Terminal 2 - Start Next.js frontend**:
```bash
cd web
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Option 3: Build for production
```bash
# Build frontend
cd web
npm run build

# Start backend (from root directory)
source venv/bin/activate
python api_server.py

# In another terminal, start frontend
cd web
npm start
```

## API Endpoints

### `POST /api/search`
Search for an Instagram user and get collaborative posts.

**Request**:
```json
{
  "username": "instagram_username"
}
```

**Response**:
```json
{
  "account_type": "Private",
  "is_private": true,
  "posts": [
    {
      "shortcode": "V2tgdUTWI6k",
      "post_url": "https://www.instagram.com/username/p/V2tgdUTWI6k/",
      "post_owner": "username",
      "is_video": false,
      "collaborators": ["https://www.instagram.com/collab1/", ...],
      "timestamp": "14:23:45"
    }
  ]
}
```

### `POST /api/download`
Download media from a specific post.

**Request**:
```json
{
  "post_url": "https://www.instagram.com/username/p/V2tgdUTWI6k/"
}
```

**Response**: Streams the media file (image or video)

### `GET /api/health`
Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "14:23:45"
}
```

### `GET /`
Root endpoint for health check.

## Configuration

### Frontend Environment Variables
Create `.env.local` in the `/web` directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend Configuration
The FastAPI backend supports custom CORS origins. Edit `api_server.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    ...
)
```

## File Structure

```
InstagramPrivSniffer/
├── api_server.py              # FastAPI backend
├── requirements.txt           # Python dependencies
├── start.sh                   # Startup script
├── WEB_INTERFACE.md          # This file
├── core/                      # Original OSINT core modules
│   ├── accountDataFetcher.py
│   └── mediaDownloader.py
└── web/                       # Next.js frontend
    ├── app/
    │   ├── page.tsx          # Main page
    │   ├── layout.tsx        # Root layout
    │   └── globals.css       # Global styles
    ├── components/
    │   ├── SearchForm.tsx
    │   ├── ResultsGrid.tsx
    │   ├── MediaViewer.tsx
    │   └── SearchHistory.tsx
    ├── lib/
    │   └── hooks.ts          # Custom hooks
    └── package.json
```

## Usage

1. **Open the web interface**: Navigate to `http://localhost:3000`
2. **Enter an Instagram username**: Type the username you want to search
3. **Click Search**: The interface will fetch collaborative posts
4. **View Results**: Browse found posts in the grid
5. **Click a post**: Opens a modal with more details
6. **Download Media**: Click "Download Media" to get the file
7. **View on Instagram**: Click "Open on Instagram" to view the original post

## Troubleshooting

### Backend not responding
- Ensure FastAPI is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify no firewall is blocking localhost connections

### CORS errors
- Backend CORS is configured for `localhost:3000` by default
- Update `allow_origins` in `api_server.py` if using different ports

### Rate limiting
- Instagram may rate-limit requests
- Wait a few minutes before trying again
- Use different IP addresses if needed

### Download fails
- Ensure the post URL is valid
- Check network connectivity
- Verify the media hasn't been deleted

## Development

### Hot Reload
Both frontend and backend support hot reload:
- Next.js: Changes to components reload instantly
- FastAPI: Requires manual restart of `api_server.py`

### For hot reload with FastAPI:
```bash
pip install uvicorn[standard]
uvicorn api_server:app --reload
```

### Frontend Development
- UI components in `/web/components`
- Hooks in `/web/lib/hooks.ts`
- Styles use Tailwind CSS with design tokens in `/web/app/globals.css`

## Performance

- **Search**: ~2-3 seconds depending on Instagram API response
- **Download**: Streams directly from Instagram (no server caching)
- **UI**: Optimized for mobile-first design, <5MB bundle size

## Security

⚠️ **Important**: This tool is for research and educational purposes only.

- No data is stored on the server
- Search history is stored locally in browser
- Downloads are streamed directly from Instagram
- No authentication required (use responsibly)

## Limitations

- Rate-limited by Instagram API
- Cannot access truly private posts (only collaborative posts visible)
- Instagram may block requests if usage is excessive
- Media URLs may expire

## License

See the main `LICENSE` file in the repository.

## Support

For issues or feature requests, open an issue on GitHub.
