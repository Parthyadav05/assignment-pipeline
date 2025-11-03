# How to Run the Application

This guide will help you run both the backend and frontend together.

## What You Need

### 1. MongoDB Database

**You already have MongoDB v8.0.5 installed!**

Just make sure it's running:

**Check if MongoDB is running:**
```bash
net start | find "MongoDB"
```

**Start MongoDB if not running:**
```bash
net start MongoDB
```

Or open a new terminal and run:
```bash
mongod
```

### 2. Node.js Dependencies

All dependencies will be installed automatically by the setup script.

## Step-by-Step Guide

### Method 1: Automated Setup (EASIEST)

1. Open PowerShell in the assignment folder
2. Run the setup script:
   ```powershell
   .\setup.bat
   ```
3. Wait for all dependencies to install
4. Run the start script:
   ```powershell
   .\start.bat
   ```

That's it! Both backend and frontend will start automatically.

### Method 2: Manual NPM Commands

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

2. Start both services:
   ```bash
   npm run dev
   ```

### Method 3: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

Once both services are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## What You'll See

### Terminal Output:

**Backend:**
```
[timestamp] [INFO] MongoDB connected successfully
[timestamp] [INFO] Server running on port 5000
```

**Frontend:**
```
Ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Testing the Application

1. Open http://localhost:3000 in your browser
2. You'll see the Contact Pipeline interface
3. Enter phone numbers in the textarea (one per line):
   ```
   +1234567890
   +9876543210
   555-123-4567
   ```
4. Click "Upload Contacts"
5. View the results and statistics

## Troubleshooting

### MongoDB Not Running

**Error:** "MongoDB connection error"

**Solution:**
```bash
# Windows
net start MongoDB

# Or open a terminal and run:
mongod
```

### Port Already in Use

**Error:** "Port 5000 already in use"

**Solution:** Stop the process using port 5000 or change the port in `backend/.env`:
```env
PORT=5001
```

### Dependencies Not Installed

**Error:** "Cannot find module"

**Solution:**
```bash
npm run install:all
```

### Frontend Build Error

**Error:** Hydration error or build issues

**Solution:**
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

## NPM Scripts Available

From the root folder:

```bash
npm run install:all     # Install all dependencies
npm run dev             # Start both backend and frontend
npm run dev:backend     # Start only backend
npm run dev:frontend    # Start only frontend
npm run build:all       # Build both for production
npm run start:all       # Start production servers
```

## Environment Variables

The application uses environment files:

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contacts-pipeline
NODE_ENV=development
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

These are created automatically by the setup script.

## Stopping the Application

Press `Ctrl + C` in the terminal where the application is running.

This will stop both backend and frontend services.

## Need More Help?

- Database setup: See [DATABASE_SETUP.md](DATABASE_SETUP.md)
- Complete documentation: See [README.md](README.md)
- Quick reference: See [QUICK_START.md](QUICK_START.md)
