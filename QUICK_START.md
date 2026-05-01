# Quick Start Guide - InstagramPrivSniffer Web Interface

## Status: ✅ Running Now

Both servers are currently running in the background:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:8000 (FastAPI)
- **API Docs**: http://localhost:8000/docs (Swagger UI)

## Open the App

Simply visit: **http://localhost:3000**

## What You Can Do

1. **Search Private Accounts** - Enter any Instagram username
2. **View Collaborative Posts** - See posts the account shared collaboratively
3. **Preview Media** - Click posts to view images/videos in-browser
4. **Download Media** - Download images/videos directly to your device
5. **View Search History** - All searches saved locally on your device

## System Architecture

```
Frontend (Next.js/React)
        ↓
    [Port 3000]
        ↓
    API Calls (HTTP)
        ↓
    [Port 8000]
        ↓
Backend (FastAPI/Python)
        ↓
Instagram Tools
```

## Terminal Commands

### Start Everything (if servers stopped)
```bash
# Terminal 1
cd /vercel/share/v0-project
source venv/bin/activate
python api_server.py

# Terminal 2
cd /vercel/share/v0-project/web
npm run dev
```

### Stop Servers
```bash
# Press Ctrl+C in each terminal
```

### Check Server Status
```bash
# Check if running
lsof -i :3000    # Frontend
lsof -i :8000    # Backend
```

## File Locations

| Component | Location | Port |
|-----------|----------|------|
| Frontend | `/web` | 3000 |
| Backend | `/api_server.py` | 8000 |
| API Docs | http://localhost:8000/docs | 8000 |
| Logs | Terminal output | - |

## API Endpoints

### Search Posts
```
POST http://localhost:8000/api/search
Content-Type: application/json

{
  "username": "instagram_username"
}
```

### Download Media
```
POST http://localhost:8000/api/download
Content-Type: application/json

{
  "url": "https://instagram.com/p/MEDIA_ID/"
}
```

## Troubleshooting

### "Cannot connect to backend"
- ✓ Check if http://localhost:8000/docs loads
- ✓ Verify FastAPI is running (check terminal 1)
- ✓ Check firewall isn't blocking port 8000

### "Blank page at localhost:3000"
- ✓ Check if http://localhost:3000 loads
- ✓ Check browser console for errors
- ✓ Verify Next.js is running (check terminal 2)

### "Search returns error"
- ✓ Check API endpoint at http://localhost:8000/docs
- ✓ Try the same search through Swagger UI first
- ✓ Check browser Network tab for full error details

### Port Already in Use
```bash
# Kill the process using the port
kill -9 $(lsof -t -i :3000)    # Kill frontend
kill -9 $(lsof -t -i :8000)    # Kill backend
```

## Documentation

- **Full Docs**: See `WEB_INTERFACE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Build Summary**: See `WEB_BUILD_SUMMARY.md`
- **API Docs**: http://localhost:8000/docs (live)

## Next Steps

1. Test the web interface at http://localhost:3000
2. Try searching for a username
3. Preview and download media
4. Check your search history
5. When ready, deploy to production (see DEPLOYMENT.md)

## Key Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.9+, Uvicorn
- **Features**: Real-time search, media preview, client-side downloads

## Support Resources

1. **Local API Documentation**: http://localhost:8000/docs
2. **Next.js Docs**: https://nextjs.org/docs
3. **FastAPI Docs**: https://fastapi.tiangolo.com
4. **Project README**: `README.md`
5. **Web Interface Docs**: `WEB_INTERFACE.md`

---

**Ready to go!** Open http://localhost:3000 and start searching.
