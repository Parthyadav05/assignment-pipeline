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

### POST /contacts/bulk
Upload phone numbers for processing.

**Headers:**
- `X-Idempotency-Key` (optional): Unique request identifier to prevent duplicate processing

**Request Body:**
```json
{
  "phoneNumbers": ["+1234567890", "+9876543210"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contacts processed successfully",
  "stats": {
    "total": 2,
    "valid": 2,
    "invalid": 0,
    "duplicates": 0
  }
}
```

### GET /contacts/stats
Get processing statistics.

**Response:**
```json
{
  "totalContacts": 100,
  "validContacts": 100,
  "invalidAttempts": 15,
  "duplicateAttempts": 25
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Idempotency Implementation

The API implements idempotency using a custom `X-Idempotency-Key` header to prevent duplicate processing of the same request.

### How It Works

1. **Frontend**: Automatically generates a unique UUID for each upload request
2. **Backend Middleware**: Checks if the request ID has been processed before
3. **Cached Response**: If found, returns the cached response immediately
4. **New Request**: If not found, processes the request and caches the response
5. **Expiry**: Idempotency records expire after 24 hours and are cleaned up hourly

### Benefits

- **Prevents Duplicate Charges**: Same request won't be processed twice
- **Network Resilience**: Safe to retry failed requests
- **User-Friendly**: Users can safely click "submit" multiple times
- **Performance**: Cached responses are instant

### Testing Idempotency

To test, submit the same phone numbers twice quickly - the second request will return instantly with the same results.

### Database Schema

The `idempotency_keys` table stores:
- `request_id`: Unique identifier (UUID)
- `response_body`: Cached JSON response
- `response_status`: HTTP status code
- `created_at`: Timestamp
- `expires_at`: Expiration timestamp (24 hours from creation)

## Project Structure

```
assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Error handling, idempotency
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

- **Phone Number Validation**: Regex-based validation for international formats
- **Duplicate Detection**: Within-batch and database-level deduplication
- **Idempotency**: Custom request ID header prevents duplicate processing
- **PostgreSQL Transactions**: Atomic operations ensure data integrity
- **Real-time Statistics**: Track total, valid, invalid, and duplicate contacts
- **Premium Black & White UI**: Minimalist, classy design
- **Automatic Cleanup**: Expired idempotency keys are cleaned up hourly

## Troubleshooting

**Connection Error**: Check PostgreSQL is running and password in `backend/.env` is correct

**Port in Use**: Change `PORT` in `backend/.env` or port in `frontend/vite.config.js`

**CORS Error**: Ensure backend is running and `VITE_API_URL` in `frontend/.env` is correct
