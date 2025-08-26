# SocialEdge - Social Media Management Platform

A modern web application for managing social media presence with AI-powered content generation, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **User Authentication**: JWT-based authentication with login/register functionality
- 🐦 **Twitter Integration**: OAuth 2.0 integration with Twitter API
- 🤖 **AI Content Generation**: Generate engaging social media content using AI
- 📊 **Analytics Dashboard**: View performance metrics and insights
- 📱 **Responsive Design**: Modern, mobile-friendly UI built with Tailwind CSS
- 🔄 **Real-time Sync**: Sync data with social media platforms
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Authentication**: JWT with jwt-decode

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running (NestJS with X Gateway endpoints)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd web-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Authentication pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   └── x/                 # Twitter/X components
└── lib/                   # Utilities and configurations
    ├── api.ts             # API client and endpoints
    ├── auth.ts            # Authentication store
    └── utils.ts           # Utility functions
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Token refresh

### X (Twitter) API

- `GET /api/v1/x/user` - Get user profile
- `GET /api/v1/x/user/:twitterId` - Get user by Twitter ID
- `GET /api/v1/x/posts` - Get user posts
- `POST /api/v1/x/connect` - Connect Twitter account
- `POST /api/v1/x/generate-content` - Generate AI content
- `GET /api/v1/x/admin/users` - Get all users (admin)

### Users API

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID

## OAuth 2.0 Flow

The application implements OAuth 2.0 for Twitter integration using a backend-driven approach:

1. **Frontend calls** `/api/v1/x/auth/url` → Gets OAuth redirect URL from backend
2. **Frontend redirects** to Twitter using the URL from backend
3. **User authorizes** the application on Twitter
4. **Twitter redirects back** to frontend with authorization code
5. **Frontend sends code** to `/api/v1/x/auth/callback` → Backend exchanges code for token
6. **Backend stores access token** securely and returns success message
7. **Frontend shows success** and user can fetch data

**Benefits:**

- ✅ **Secure**: Backend handles sensitive OAuth credentials
- ✅ **Clean**: Frontend only handles redirects and API calls
- ✅ **Maintainable**: OAuth logic centralized in backend
- ✅ **Scalable**: Easy to add more OAuth providers

## Key Components

### Authentication

- `LoginForm`: User login with email/password
- `RegisterForm`: User registration with validation
- `useAuthStore`: Zustand store for authentication state

### Twitter Integration

- `TwitterConnect`: OAuth connection and manual token input
- `TwitterUserProfile`: Display user profile with sync functionality
- `TwitterPosts`: Display posts with pagination and sync

### Content Generation

- `ContentGenerator`: AI-powered content generation with customization options

### Layout

- `Header`: Navigation and user menu
- `Sidebar`: Collapsible navigation sidebar
- `DashboardLayout`: Protected layout for authenticated users

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for form management
- Zustand for state management
- Lucide React for icons

### Environment Variables

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |

## Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start the production server**

   ```bash
   npm start
   ```

3. **Environment setup**
   Ensure all environment variables are set in your production environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
