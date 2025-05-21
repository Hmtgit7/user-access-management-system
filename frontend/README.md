# User Access Management System - Frontend

This is the React frontend application for the User Access Management System. It provides a user interface for authentication, software access management, and request workflows based on role-based permissions.

## Technology Stack

- **Framework**: React
- **Language**: TypeScript
- **UI Libraries**: Material UI, Tailwind CSS
- **Form Management**: Formik with Yup validation
- **HTTP Client**: Axios
- **Routing**: React Router
- **State Management**: React Context API

## Project Structure

```
frontend/
├── public/               # Static files
├── src/
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── software/     # Software management components
│   │   ├── requests/     # Request handling components
│   │   ├── common/       # Shared UI components
│   │   └── layouts/      # Page layout components
│   ├── pages/            # Route pages
│   ├── context/          # React contexts (Auth)
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main component
│   └── index.tsx         # Entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Documentation (this file)
```

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- Backend API server running (see ../backend/README.md)

### Local Setup

1. Clone the repository:

```bash
git clone https://github.com/Hmtgit7/user-access-management-system.git
cd user-access-management-system/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:3001/api
```

4. Start the development server:

```bash
npm start
```

5. Open your browser and visit http://localhost:3000

### Docker Setup

1. Build the Docker image:

```bash
docker build -t uams-frontend .
```

2. Run the container:

```bash
docker run -p 3000:3000 -d uams-frontend
```

## Features and Pages

### Authentication

- **Login Page**: User authentication with JWT
- **Signup Page**: New user registration

### Dashboard

- **Overview**: Display user's access requests and system status
- **Software List**: View available software
- **Quick Actions**: Role-specific action buttons

### Employee Features

- **Request Access**: Submit access requests for software
- **View Requests**: Track request history and status

### Manager Features

- **Pending Requests**: Review and manage access requests
- **Approve/Reject**: Process requests with comments

### Admin Features

- **Software Management**: Create and manage software entries
- **Access Control**: Define access levels for software

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This generates a `build` directory with static files that can be deployed to any web server or hosting service.

## Deployment

The frontend is designed to be deployed to static hosting services like Vercel, Netlify, or GitHub Pages.

Current deployment: [https://user-access-management-system.vercel.app/](https://user-access-management-system.vercel.app/)

## Testing User Roles

You can test different roles with these accounts:

- Admin: `admin/admin123`
- Manager: `manager/password123`
- Employee: `employee/password123`

## Customization

### Theming

The application uses Material UI with custom Tailwind CSS integration. You can modify the theme in:

- `src/index.tsx` for Material UI theme
- `tailwind.config.js` for Tailwind customization

### Adding New Features

To extend the application, consider:

1. Create new components in appropriate folders
2. Add API service functions in `services/`
3. Update routes in `App.tsx`
4. Update context providers if needed

## License

This project is licensed under the MIT License.
