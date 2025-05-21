# User Access Management System - Backend

This is the backend server for the User Access Management System, built with Node.js, Express, TypeScript, and TypeORM.

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Hmtgit7/user-access-management-system.git
cd user-access-management-system/backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:

```
PORT=3001
JWT_SECRET=your_secret_key_here
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
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

For production:

```bash
npm run build
npm start
```

The server will start on http://localhost:3001.

## Troubleshooting Common Errors

### TypeScript Compilation Errors

If you get TypeScript compilation errors, try:

```bash
npm run typecheck
```

This will show you all type checking errors without emitting any files.

### Database Connection Issues

- Make sure PostgreSQL is running
- Check that your database credentials in `.env` are correct
- You might need to create the database manually: `CREATE DATABASE user_access_management;`

### JWT Authentication Issues

- Check that your JWT_SECRET is properly set in `.env`
- Ensure you're including the token in the Authorization header as: `Bearer <token>`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user (default role: Employee)
  - Body: `{ username, password, email, fullName }`
- `POST /api/auth/login` - Login and receive JWT token
  - Body: `{ username, password }`
- `GET /api/auth/me` - Get current user details (requires authentication)

### Software Management

- `GET /api/software` - Get all software (requires authentication)
- `GET /api/software/:id` - Get software by ID (requires authentication)
- `POST /api/software` - Create new software (Admin only)
  - Body: `{ name, description, accessLevels }`
- `PUT /api/software/:id` - Update software (Admin only)
  - Body: `{ name, description, accessLevels }`
- `DELETE /api/software/:id` - Delete software (Admin only)

### Access Requests

- `POST /api/requests` - Create a new access request (Employee, Manager, Admin)
  - Body: `{ softwareId, accessType, reason }`
- `GET /api/requests/my-requests` - Get user's requests (requires authentication)
- `GET /api/requests/:id` - Get request by ID (requires authentication)
- `GET /api/requests/pending` - Get all pending requests (Manager, Admin only)
- `PATCH /api/requests/:id/status` - Update request status (Manager, Admin only)
  - Body: `{ status, reviewComment }`
