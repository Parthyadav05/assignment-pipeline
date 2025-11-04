# Contact Processing Pipeline

A premium contact management system with phone number validation, deduplication, and statistics tracking.

## Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Language**: JavaScript

## Prerequisites

1. **Node.js** (v16+) - https://nodejs.org/
2. **PostgreSQL** (v12+) - https://www.postgresql.org/download/

## Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Create Database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE contacts_pipeline;
```

Then connect to the database and run `setup-database.sql`

### 3. Configure Database Connection

Edit `backend/.env` with your PostgreSQL password:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/contacts_pipeline
```

## Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Open**: http://localhost:3000

## API Endpoints

- `POST /contacts/bulk` - Upload phone numbers
- `GET /contacts/stats` - Get statistics
- `GET /health` - Health check

## Project Structure

```
assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Database, logger, validation
│   │   └── index.js         # Entry point
│   ├── .env                 # Database config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # API utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── .env                 # API URL
│   ├── vite.config.js
│   └── package.json
│
├── setup-database.sql       # Database schema
└── README.md
```

## Features

- Phone number validation
- Duplicate detection
- PostgreSQL transactions
- Real-time statistics
- Premium black & white UI

## Troubleshooting

**Connection Error**: Check PostgreSQL is running and password in `backend/.env` is correct

**Port in Use**: Change `PORT` in `backend/.env` or port in `frontend/vite.config.js`

**CORS Error**: Ensure backend is running and `VITE_API_URL` in `frontend/.env` is correct
