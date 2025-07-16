# Event Management API

A robust REST API for managing events and user registrations built with Node.js, Express, and PostgreSQL.

## Features

- ✅ Event creation and management
- ✅ User registration system
- ✅ Many-to-many relationship between users and events
- ✅ Capacity management (max 1000 per event)
- ✅ Duplicate registration prevention
- ✅ Past event registration blocking
- ✅ Custom sorting for upcoming events
- ✅ Real-time event statistics
- ✅ Concurrent operation handling
- ✅ Comprehensive error handling
- ✅ Input validation with Joi
- ✅ Rate limiting and security headers

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone "https://github.com/CreatorRama/Event-Management"
   cd event-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=event_management
   DB_USER=your_username
   DB_PASSWORD=your_password
   PORT=5000
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE event_management;
   ```

5. **Set up database schema**
   ```bash
   npm run setup
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Events

#### 1. Create Event
**POST** `/events`

Creates a new event with validation.

**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "date_time": "2024-08-15T10:00:00Z",
  "location": "San Francisco, CA",
  "capacity": 500
}
```

**Response (201):**
```json
{
  "message": "Event created successfully",
  "event_id": "123e4567-e89b-12d3-a456-426614174000",
  "event": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Tech Conference 2024",
    "date_time": "2024-08-15T10:00:00.000Z",
    "location": "San Francisco, CA",
    "capacity": 500,
    "created_at": "2024-07-15T12:00:00.000Z"
  }
}
```

**Validation Rules:**
- `title`: Required, 1-255 characters
- `date_time`: Required, ISO 8601 format, must be future date
- `location`: Required, 1-255 characters
- `capacity`: Required, integer, 1-1000

#### 2. Get Event Details
**GET** `/events/{id}`

Retrieves event details with registered users.

**Response (200):**
```json
{
  "event": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Tech Conference 2024",
    "date_time": "2024-08-15T10:00:00.000Z",
    "location": "San Francisco, CA",
    "capacity": 500,
    "registration_count": 2,
    "registered_users": [
      {
        "id": "user-uuid-1",
        "name": "John Doe",
        "email": "john@example.com",
        "registered_at": "2024-07-15T12:30:00.000Z"
      },
      {
        "id": "user-uuid-2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "registered_at": "2024-07-15T13:00:00.000Z"
      }
    ]
  }
}
```

#### 3. Register for Event
**POST** `/events/{id}/register`

Registers a user for an event with comprehensive validation.

**Request Body:**
```json
{
  "user_id": "user-uuid-1"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "registration": {
    "id": "registration-uuid",
    "user_id": "user-uuid-1",
    "event_id": "123e4567-e89b-12d3-a456-426614174000",
    "registered_at": "2024-07-15T12:30:00.000Z"
  }
}
```

**Business Rules:**
- User must exist
- Event must exist and be in the future
- User cannot register twice for the same event
- Event cannot be full (capacity reached)

#### 4. Cancel Registration
**DELETE** `/events/{id}/register`

Cancels a user's registration for an event.

**Request Body:**
```json
{
  "user_id": "user-uuid-1"
}
```

**Response (200):**
```json
{
  "message": "Registration cancelled successfully"
}
```

#### 5. List Upcoming Events
**GET** `/events`

Returns all future events with custom sorting.

**Response (200):**
```json
{
  "events": [
    {
      "id": "event-uuid-1",
      "title": "Tech Conference 2024",
      "date_time": "2024-08-15T10:00:00.000Z",
      "location": "Austin, TX",
      "capacity": 500,
      "registration_count": 150,
      "remaining_capacity": 350
    },
    {
      "id": "event-uuid-2",
      "title": "Web Summit",
      "date_time": "2024-08-15T10:00:00.000Z",
      "location": "San Francisco, CA",
      "capacity": 1000,
      "registration_count": 800,
      "remaining_capacity": 200
    }
  ]
}
```

**Sorting Logic:**
1. By date (ascending)
2. By location (alphabetical)

#### 6. Get Event Statistics
**GET** `/events/{id}/stats`

Returns detailed statistics for an event.

**Response (200):**
```json
{
  "stats": {
    "total_registrations": 150,
    "remaining_capacity": 350,
    "percentage_used": 30.0
  }
}
```

### Users

#### 1. Create User
**POST** `/users`

Creates a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user-uuid-1",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-07-15T12:00:00.000Z"
  }
}
```

#### 2. Get All Users
**GET** `/users`

Returns all users sorted by name.

**Response (200):**
```json
{
  "users": [
    {
      "id": "user-uuid-1",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-07-15T12:00:00.000Z"
    }
  ]
}
```

#### 3. Get User by ID
**GET** `/users/{id}`

Returns a specific user.

**Response (200):**
```json
{
  "user": {
    "id": "user-uuid-1",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-07-15T12:00:00.000Z"
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation Error",
  "details": ["\"capacity\" must be less than or equal to 1000"]
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Event not found"
}
```

**409 Conflict:**
```json
{
  "error": "Registration Error",
  "message": "User is already registered for this event"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Event Registrations Table
```sql
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);
```

## Testing with cURL

### Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

### Create an Event
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2024",
    "date_time": "2024-12-15T10:00:00Z",
    "location": "San Francisco, CA",
    "capacity": 500
  }'
```

### Register for Event
```bash
curl -X POST http://localhost:5000/api/events/{event-id}/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user-id}"
  }'
```

### Get Event Details
```bash
curl -X GET http://localhost:5000/api/events/{event-id}
```

### Get Upcoming Events
```bash
curl -X GET http://localhost:5000/api/events
```

### Get Event Statistics
```bash
curl -X GET http://localhost:5000/api/events/{event-id}/stats
```

### Cancel Registration
```bash
curl -X DELETE http://localhost:5000/api/events/{event-id}/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "{user-id}"
  }'
```

## Architecture & Design Decisions

### Data Structures & Algorithms

1. **Custom Sorting Algorithm**: The upcoming events endpoint uses a custom comparator that sorts by date first (ascending), then by location alphabetically.

2. **Efficient Queries**: Database queries are optimized with proper indexes on frequently queried columns (`date_time`, `location`, `event_id`, `user_id`).

3. **Connection Pooling**: PostgreSQL connection pooling is implemented to handle concurrent requests efficiently.

4. **Transaction Management**: Registration operations use database transactions to ensure data consistency during concurrent operations.

### Concurrency Handling

- **Database Transactions**: All registration/cancellation operations are wrapped in transactions
- **Unique Constraints**: Database-level unique constraints prevent duplicate registrations
- **Connection Pooling**: Handles multiple simultaneous requests efficiently
- **Row-level Locking**: PostgreSQL's MVCC handles concurrent access automatically

### Security Features

- **Input Validation**: Comprehensive validation using Joi schema validation
- **Rate Limiting**: Prevents API abuse with configurable rate limits
- **Security Headers**: Helmet.js adds security headers
- **SQL Injection Protection**: Parameterized queries prevent SQL injection
- **CORS Configuration**: Proper CORS setup for cross-origin requests

### Error Handling Strategy

- **Centralized Error Handler**: Single middleware handles all errors consistently
- **Custom Error Classes**: Specific error types for different scenarios
- **Appropriate HTTP Status Codes**: Proper status codes for different error types
- **Detailed Error Messages**: Clear, actionable error messages for developers
- **Environment-specific Responses**: Different error details for development vs production

## Performance Optimizations

1. **Database Indexes**: Strategic indexes on frequently queried columns
2. **Connection Pooling**: Efficient database connection management
3. **Query Optimization**: Efficient JOIN operations and aggregations
4. **Memory Management**: Proper cleanup of database connections
5. **Caching Ready**: Architecture supports adding Redis caching layer

## Business Logic Implementation

### Registration Constraints
- **Capacity Validation**: Real-time capacity checking during registration
- **Time Validation**: Prevents registration for past events
- **Duplicate Prevention**: Database constraints prevent duplicate registrations
- **User Existence**: Validates user exists before registration

### Event Management
- **Future Events Only**: Listing endpoint only shows upcoming events
- **Custom Sorting**: Implements specific sorting requirements
- **Real-time Statistics**: Accurate capacity and usage calculations
- **Data Integrity**: Foreign key constraints maintain referential integrity

## Deployment Considerations

### Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=production

# Security (optional)
JWT_SECRET=your_jwt_secret_here
```
