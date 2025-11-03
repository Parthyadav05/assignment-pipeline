#!/bin/bash

echo "=========================================="
echo "Contact Pipeline Setup Script"
echo "=========================================="
echo ""

echo "[1/5] Checking MongoDB..."
if pgrep -x mongod > /dev/null; then
    echo "MongoDB is already running"
elif systemctl is-active --quiet mongod 2>/dev/null; then
    echo "MongoDB service is running"
else
    echo "MongoDB is not running. Starting MongoDB..."
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
        if [ $? -eq 0 ]; then
            echo "MongoDB started successfully"
        else
            echo ""
            echo "WARNING: Could not start MongoDB service."
            echo "Please start MongoDB manually: mongod"
            echo ""
            read -p "Press Enter to continue..."
        fi
    else
        echo ""
        echo "Please start MongoDB manually in another terminal:"
        echo "  mongod"
        echo ""
        read -p "Press Enter to continue..."
    fi
fi

echo ""
echo "[2/5] Creating environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env"
else
    echo "backend/.env already exists"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "Created frontend/.env.local"
else
    echo "frontend/.env.local already exists"
fi

echo ""
echo "[3/5] Installing root dependencies..."
npm install

echo ""
echo "[4/5] Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "[5/5] Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application, run:"
echo "  npm run dev"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
