#!/bin/bash

echo "🐾 Starting PawHub..."

# 1. Start the backend in the background
echo "-> Starting Backend API (Port 5001)..."
cd backend
npm install
npm start &
BACKEND_PID=$!
cd ..

# 2. Wait a few seconds to ensure backend is up (and memory db is seeded)
sleep 4

# 3. Start the frontend
echo "-> Starting Frontend App (Port 5173)..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ PawHub is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all servers."

# Wait for user interrupt, then kill both processes
trap "echo 'Shutting down PawHub...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
