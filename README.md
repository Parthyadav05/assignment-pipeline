# Contact Processing Pipeline - Variant B

A data processing pipeline for handling bulk contact uploads with phone number validation, deduplication, and statistics tracking.

## Variant

**Variant B**: Transaction handling for atomic insert operations using MongoDB sessions.

## Features

- Bulk phone number upload via REST API
- Phone number format validation using regex
- Duplicate detection before database insertion
- Atomic transactions for data consistency
- Real-time statistics tracking
- Clean React component structure with Next.js frontend
- TypeScript for type safety across frontend and backend
- Comprehensive error handling and logging

## Technology Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- MongoDB Sessions for transaction handling

### Frontend
- Next.js 14
- React 18
- TypeScript

## Project Structure

```
assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Error handling
│   │   ├── utils/             # Validation, logging, database
│   │   ├── types/             # TypeScript interfaces
│   │   └── index.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   ├── lib/               # API utilities
│   │   └── types/             # TypeScript interfaces
│   ├── package.json
│   └── next.config.js
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment
```

### 2. MongoDB Setup

Ensure MongoDB is running on your local machine:

```bash
mongod
```

The default connection string is `mongodb://localhost:27017/contacts-pipeline`

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contacts-pipeline
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment mode (development/production) - **Note: This is optional in .env file**

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:5000)

### Understanding NODE_ENV

`NODE_ENV` is a special environment variable that indicates the runtime environment. It can be set in multiple ways:

#### Option 1: Via npm scripts (Recommended - Cross-platform)
The package.json uses `cross-env` to set NODE_ENV automatically:
```bash
npm run dev          # Sets NODE_ENV=development
npm run start        # Sets NODE_ENV=production
```

#### Option 2: In .env file (For local development)
```env
NODE_ENV=development
```
The `dotenv` package loads this value from the `.env` file.

#### Option 3: System environment variable (For production servers)
```bash
# Linux/Mac
export NODE_ENV=production
node dist/index.js

# Windows
set NODE_ENV=production
node dist/index.js
```

**Priority Order** (highest to lowest):
1. System environment variables
2. npm script environment variables (via cross-env)
3. .env file variables

**Where the value comes from:**
- During development: Automatically set by `npm run dev` via cross-env
- In production: Set by your hosting platform or deployment script
- The .env file acts as a fallback if not set elsewhere

## API Endpoints

### POST /contacts/bulk

Upload bulk phone numbers for processing.

**Request Body:**
```json
{
  "phoneNumbers": [
    "+1234567890",
    "+9876543210",
    "1234567890"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contacts processed successfully",
  "stats": {
    "total": 3,
    "valid": 2,
    "invalid": 0,
    "duplicates": 1
  }
}
```

### GET /contacts/stats

Retrieve statistics about processed contacts.

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

## Implementation Details

### Transaction Handling (Variant B)

The application uses MongoDB sessions to ensure atomic operations during bulk contact insertion:

1. A session is started before processing
2. All database operations (inserts to both Contact and ProcessingLog collections) occur within a transaction
3. If any operation fails, the entire transaction is rolled back
4. Transaction commits only when all operations succeed

**Implementation:** `backend/src/services/contactService.ts:69`

### Validation Logic

Phone numbers are validated using a regex pattern that accepts:
- International format with country code
- Numbers with/without spaces, dots, or hyphens
- 10-15 digit phone numbers

**Implementation:** `backend/src/utils/validation.ts:1`

### Deduplication Strategy

1. In-memory deduplication within the uploaded batch
2. Database-level deduplication by checking existing contacts
3. Unique index on phoneNumber field in MongoDB
4. All duplicates are tracked in ProcessingLog

**Implementation:** `backend/src/services/contactService.ts:11`

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Enter phone numbers in the textarea (one per line)
3. Click "Upload Contacts" to process the numbers
4. View the upload results immediately below the form
5. Check the Statistics section for overall counts
6. Click "Refresh" to update statistics manually

Example phone numbers for testing:
```
+1234567890
+9876543210
1234567890
555-123-4567
+44 20 7123 4567
invalid-number
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Error Handling

- Input validation errors return 400 status
- Server errors return 500 status with error messages
- All errors are logged with timestamps
- Frontend displays user-friendly error messages

## Logging

The application uses a custom Logger utility that provides:
- Timestamped log entries
- Different log levels (INFO, ERROR, WARN)
- Structured logging for better debugging

## Total Setup Time

The application can be set up and running in under 5 minutes:
1. Install backend dependencies (1 min)
2. Install frontend dependencies (1 min)
3. Configure environment variables (30 sec)
4. Start MongoDB (30 sec)
5. Start both servers (30 sec)

## Maintainability Features

- TypeScript for type safety
- Modular architecture with separation of concerns
- Consistent code structure
- Comprehensive error handling
- Reusable components
- Clear naming conventions
- Environment-based configuration

## Future Enhancements

- Authentication and authorization
- Rate limiting for API endpoints
- Pagination for large datasets
- Export functionality for contacts
- Advanced phone number validation with libphonenumber
- Batch processing for very large uploads
- WebSocket for real-time updates
- Unit and integration tests

## License

MIT

## Author

Intern Technical Assignment - Variant B
