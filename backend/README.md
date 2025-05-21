# User Access Management System - Backend

This is the backend API server for the User Access Management System. It provides endpoints for user authentication, software management, and request handling with role-based access control.

## Technology Stack

- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Additional Tools**: bcrypt (password hashing), dotenv, cors

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── software.controller.ts
│   │   └── request.controller.ts
│   ├── entities/         # TypeORM entities
│   │   ├── User.ts
│   │   ├── Software.ts
│   │   └── Request.ts
│   ├── middleware/       # Auth middleware, role validation
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   ├── software.routes.ts
│   │   └── request.routes.ts
│   ├── config/           # Configuration files
│   │   └── database.ts
│   ├── utils/            # Utility functions
│   │   ├── jwt.ts
│   │   └── constants.ts
│   ├── app.ts            # Express app setup
│   └── index.ts          # Entry point
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Documentation (this file)
```

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Local Setup

1. Clone the repository:

```bash
git clone https://github.com/Hmtgit7/user-access-management-system.git
cd user-access-management-system/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```
PORT=3001
JWT_SECRET=your_jwt_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=user_access_management
```

4. Create a PostgreSQL database:

```sql
CREATE DATABASE user_access_management;
```

5. Start the development server:

```bash
npm run dev
```

### Docker Setup

1. Build the Docker image:

```bash
docker build -t uams-backend .
```

2. Run the container:

```bash
docker run -p 3001:3001 -d uams-backend
```

## Database Initialization

The application will create database tables on first run, but you'll need to create an admin user manually.

You can run the provided SQL script to set up initial test data:

```bash
psql -U postgres -d user_access_management < seed.sql
```

Or manually run these SQL commands:

```sql
INSERT INTO "user" (username, password, role, email, "fullName", "createdAt")
VALUES
('admin', '$2b$10$zZZ/J69hE.FP0zxO3cOKbefUiCt0J2VJxA9xEVoAS5UKBGSGqF7v6', 'Admin', 'admin@example.com', 'System Administrator', CURRENT_TIMESTAMP),
('manager', '$2b$10$HwSOBvxAVlkF4q/U3QlZ5.D7WwJHzxmjY8NrA1zvqGb2bRVGwGDfG', 'Manager', 'manager@example.com', 'Team Manager', CURRENT_TIMESTAMP),
('employee', '$2b$10$IFpjhH/rN6e2OTt9TS2CtONRNBUAM9r5q1wMJf.IdwLql2jQEygoy', 'Employee', 'employee@example.com', 'Regular Employee', CURRENT_TIMESTAMP);
```

These accounts have the following passwords:

- admin: admin123
- manager: password123
- employee: password123

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Software Management (Admin)

- `GET /api/software` - Get all software
- `GET /api/software/:id` - Get software by ID
- `POST /api/software` - Add new software
- `PUT /api/software/:id` - Update software
- `DELETE /api/software/:id` - Delete software

### Access Requests

- `POST /api/requests` - Submit access request
- `GET /api/requests/my-requests` - Get user's requests
- `GET /api/requests/pending` - Get all pending requests (Managers only)
- `GET /api/requests/:id` - Get request by ID
- `PATCH /api/requests/:id/status` - Approve or reject request (Managers only)

## Testing

You can use tools like Postman or curl to test the API endpoints.

### Example API Test with curl

Login:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Create software (with auth token):

```bash
curl -X POST http://localhost:3001/api/software \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Microsoft Office","description":"Office productivity suite","accessLevels":["Read","Write","Admin"]}'
```

## Building for Production

To compile TypeScript to JavaScript for production:

```bash
npm run build
```

This creates a `dist` directory with the compiled code. To run the production build:

```bash
npm start
```

## License

This project is licensed under the MIT License.
