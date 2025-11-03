# Database Setup Guide

This project uses MongoDB as the database. You have two options:

## Option 1: Local MongoDB (Recommended for Development)

### Windows

#### Check if MongoDB is installed:
```bash
mongod --version
```

If installed, you should see version information.

#### Start MongoDB:

**Method 1: As a Windows Service (Recommended)**
```bash
net start MongoDB
```

**Method 2: Manual Start**
Open a new terminal and run:
```bash
mongod
```
Keep this terminal running.

#### Verify MongoDB is Running:
```bash
mongosh
```
If it connects, MongoDB is running correctly.

### Linux

#### Install MongoDB (if not installed):
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# Fedora/RHEL
sudo yum install -y mongodb-org
```

#### Start MongoDB:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Verify:
```bash
sudo systemctl status mongod
mongosh
```

### macOS

#### Install MongoDB (if not installed):
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Start MongoDB:
```bash
brew services start mongodb-community
```

#### Verify:
```bash
mongosh
```

## Option 2: MongoDB Atlas (Cloud Database)

If you prefer not to run MongoDB locally, use MongoDB Atlas (free tier available):

### Steps:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Click "Connect" on your cluster
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for development)
6. Create a database user with username and password
7. Choose "Connect your application"
8. Copy the connection string

### Update Your .env File:

Open `backend/.env` and update:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/contacts-pipeline?retryWrites=true&w=majority
```

Replace:
- `username` with your database username
- `password` with your database password
- `cluster.xxxxx.mongodb.net` with your actual cluster address

## Default Configuration

The project is configured with:
```env
MONGODB_URI=mongodb://localhost:27017/contacts-pipeline
```

This connects to:
- Host: localhost
- Port: 27017 (default MongoDB port)
- Database: contacts-pipeline

## Verify Database Connection

After starting the backend, you should see:
```
[timestamp] [INFO] MongoDB connected successfully
[timestamp] [INFO] Server running on port 5000
```

If you see connection errors:
1. Ensure MongoDB is running
2. Check the MONGODB_URI in backend/.env
3. Verify port 27017 is not blocked by firewall

## Troubleshooting

### "Connection refused" error:
- MongoDB is not running. Start it using the commands above.

### "Authentication failed" error:
- Check your username/password in the connection string
- Ensure the database user has proper permissions

### "Port 27017 already in use":
- MongoDB is already running
- Or another service is using port 27017

### View Database Contents:

```bash
# Connect to MongoDB shell
mongosh

# Switch to your database
use contacts-pipeline

# View all contacts
db.contacts.find()

# View processing logs
db.processinglogs.find()

# View statistics
db.contacts.countDocuments()
db.processinglogs.countDocuments()

# Exit
exit
```

## Quick Test

After setup, test the database connection:

```bash
# Start backend
cd backend
npm run dev
```

If you see "MongoDB connected successfully", the database is working correctly.
