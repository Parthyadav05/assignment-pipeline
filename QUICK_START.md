# Quick Start Guide

## Prerequisites Check

Before running the application, ensure you have:
- Node.js v18+ installed
- MongoDB installed and running

## Step-by-Step Setup

### 1. Start MongoDB

Open a terminal and start MongoDB:

```bash
mongod
```

Or if MongoDB is installed as a service:

**Windows:**
```bash
net start MongoDB
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
```

### 2. Backend Setup

Open a terminal in the project directory:

```bash
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
cp .env.example .env

# Start development server
npm run dev
```

The backend will run on http://localhost:5000

### 3. Frontend Setup

Open a NEW terminal in the project directory:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (if not exists)
cp .env.local.example .env.local

# Start development server
npm run dev
```

The frontend will run on http://localhost:3000

### 4. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Common Commands

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Start production server (requires build first)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server (requires build first)
```

## Troubleshooting

### "Cannot find module" error
- Make sure you run `npm install` first
- Use `npm run dev`, not `node index.ts`

### "Connection refused" error
- Ensure MongoDB is running with `mongod`
- Check if port 27017 is available

### "Port already in use" error
- Backend: Change PORT in .env file
- Frontend: It will automatically suggest another port

### CORS errors
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
