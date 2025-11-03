#!/bin/bash

echo "=========================================="
echo "Starting Contact Pipeline"
echo "=========================================="
echo ""

echo "Checking MongoDB status..."
if pgrep -x mongod > /dev/null || systemctl is-active --quiet mongod 2>/dev/null; then
    echo "MongoDB is running"
else
    echo "WARNING: MongoDB is not running!"
    echo "Please start MongoDB manually:"
    echo "  mongod"
    echo "Or:"
    echo "  sudo systemctl start mongod"
    echo ""
    exit 1
fi

echo ""
echo "Starting Backend and Frontend..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

npm run dev
