#!/bin/bash

# InstagramPrivSniffer Web Interface - Startup Script
# This script starts both the FastAPI backend and Next.js frontend

echo "🚀 Starting InstagramPrivSniffer Web Interface..."

# Create directories if they don't exist
mkdir -p InstaDownloads

# Activate Python virtual environment
echo "📦 Activating Python virtual environment..."
source venv/bin/activate

# Start FastAPI backend in background
echo "🔧 Starting FastAPI backend on http://localhost:8000"
python api_server.py &
BACKEND_PID=$!

# Give backend time to start
sleep 2

# Start Next.js frontend in background
echo "🎨 Starting Next.js frontend on http://localhost:3000"
cd web
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo "✅ InstagramPrivSniffer is ready!"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
