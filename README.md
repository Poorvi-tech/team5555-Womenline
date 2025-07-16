# WomenLine Authentication Service

## Overview
WomenLine is India's first AI-powered, multilingual, and culturally intelligent personal wellness platform for women across all life stages. This authentication service is a crucial component of the WomenLine platform, providing secure user registration and login functionalities.

## Project Structure
```
womenline-auth
├── controllers
│   └── authController.js
├── middleware
│   └── authMiddleware.js
├── models
│   └── User.js
├── routes
│   └── authRoutes.js
├── src
│   └── index.js
├── .env
├── package.json
└── README.md
```

## Features
- User registration and login using JWT for secure authentication.
- Passwords are hashed using bcryptjs for enhanced security.
- Protected routes that require authentication via JWT.

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone https://github.com/your-repo/womenline-auth.git
   cd womenline-auth
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Create a `.env` file:**
   - Copy the `.env.example` to `.env` and fill in the required environment variables, including JWT secrets and database connection strings.

4. **Run the application:**
   ```
   npm start
   ```

## Usage
- **Register a new user:**
  - Endpoint: `POST /api/auth/register`
  - Body: `{ "username": "your_username", "email": "your_email", "password": "your_password" }`

- **Login a user:**
  - Endpoint: `POST /api/auth/login`
  - Body: `{ "email": "your_email", "password": "your_password" }`

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.