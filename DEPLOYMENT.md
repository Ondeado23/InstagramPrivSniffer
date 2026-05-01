# Deployment Guide - InstagramPrivSniffer Web Interface

## Overview

The InstagramPrivSniffer web interface consists of two main components:
1. **Frontend**: Next.js 16 React application running on port 3000
2. **Backend**: FastAPI Python application running on port 8000

Both are fully built and ready to deploy.

## Local Development

### Prerequisites
- Python 3.9+
- Node.js 18+
- Virtual environment (venv)

### Quick Start

1. **Activate Python Virtual Environment**
   ```bash
   cd /vercel/share/v0-project
   source venv/bin/activate  # or: venv\Scripts\activate on Windows
   ```

2. **Start FastAPI Backend** (Terminal 1)
   ```bash
   python api_server.py
   ```
   The backend will be available at: http://localhost:8000
   Swagger API docs: http://localhost:8000/docs

3. **Start Next.js Frontend** (Terminal 2)
   ```bash
   cd web
   npm run dev
   ```
   The frontend will be available at: http://localhost:3000

4. **Access the Application**
   Open your browser and navigate to: http://localhost:3000

## Production Deployment

### Option 1: Vercel (Recommended)

#### Deploy Frontend
1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variables in project settings:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```
5. Deploy

#### Deploy Backend (Python)

For the Python backend, you have several options:

**a) Railway, Render, or PythonAnywhere**
- Push code to GitHub
- Connect repository and deploy
- Set environment variables if needed

**b) Docker + Your Own Server**
Create a `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "api_server:app", "--host", "0.0.0.0", "--port", "8000"]
```

Deploy with:
```bash
docker build -t instagramsniffer-api .
docker run -p 8000:8000 instagramsniffer-api
```

### Option 2: Docker Compose (Full Stack)

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
      - web
```

Run with:
```bash
docker-compose up -d
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000  # or your production API URL
```

### Backend (api_server.py)
No required environment variables. All configuration is hardcoded.

## API Endpoints

### POST /api/search
Search for collaborative posts on a private Instagram account.

**Request:**
```json
{
  "username": "instagram_username"
}
```

**Response:**
```json
{
  "username": "instagram_username",
  "is_private": true,
  "account_type": "private",
  "posts": [
    {
      "media_id": "123456",
      "caption": "Post caption",
      "media_url": "https://...",
      "type": "image"
    }
  ]
}
```

### POST /api/download
Download media directly from Instagram.

**Request:**
```json
{
  "url": "https://instagram.com/p/ABC123/"
}
```

**Response:** Binary file stream

## Troubleshooting

### Backend Won't Start
- Ensure Python 3.9+ is installed
- Check virtual environment is activated
- Run: `pip install -r requirements.txt`

### Frontend Won't Connect to Backend
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Browser console will show CORS or connection errors

### Port Already in Use
- Backend: `lsof -i :8000` then `kill -9 <PID>`
- Frontend: `lsof -i :3000` then `kill -9 <PID>`

## Performance Optimization

1. **Frontend**: Already optimized with Next.js 16 and Turbopack
2. **Backend**: Uses async/await for non-blocking I/O
3. **Caching**: Implement Redis for frequently accessed data (future enhancement)

## Security Considerations

- Keep Python packages updated: `pip install --upgrade -r requirements.txt`
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Add authentication if exposing to public
- Validate all user inputs on both frontend and backend

## Monitoring

### Frontend
- Use Vercel Analytics
- Monitor Next.js build performance
- Check client-side errors in browser console

### Backend
- Monitor uvicorn logs for errors
- Track API response times
- Monitor memory usage

## Next Steps

1. Customize branding and styling
2. Add user authentication
3. Implement caching layer
4. Set up monitoring and logging
5. Add rate limiting
6. Deploy to production

For detailed web interface documentation, see [WEB_INTERFACE.md](WEB_INTERFACE.md)
