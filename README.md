# Google Login Client

A React client application implementing social login functionality using Google OAuth.

## Features

- Authentication using Google OAuth 2.0
- Access token and refresh token management after login
- Token information display and copy functionality
- Logout functionality

## Tech Stack

- React 19
- TypeScript
- @react-oauth/google - Google OAuth integration
- CSS - Styling

## Getting Started

### Prerequisites

- Node.js (16.x or higher)
- npm or yarn
- OAuth 2.0 client ID created in Google Cloud Platform

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/google-login-client.git
cd google-login-client
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables (if needed)

   - Create a `.env` file in the root folder and set necessary environment variables

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Backend API Integration

This client uses the following API endpoints:

- POST `/auth/google`: Handles Google OAuth authentication
  - Request body: `{ idToken: string }`
  - Response: `{ accessToken: string, refreshToken: string }`

By default, the backend server URL is set to `http://localhost:8080`. To use a different address, modify the URL in the `Login.tsx` file.

## Notes

- CORS issues may occur in development environment. Proper CORS configuration is required on the backend server.
- For production environments, it's recommended to manage the client ID using environment variables for security.
- Token management should use more secure methods (e.g., HttpOnly cookies, encrypted storage) in real applications.
