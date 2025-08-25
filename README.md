# Social Edge - Platform Connection Demo

A modern single-page application for connecting social media platforms with a beautiful UI and server-side API handling.

## Features

- **Multi-Platform Support**: Connect to Instagram, Twitter, and Facebook
- **Modern UI**: Beautiful gradient design with smooth animations
- **Server-Side API Routes**: Secure authentication handling
- **External API Integration**: Instagram connects to localhost:3005
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic theme detection

## Platform Configuration

### Instagram

- **Endpoint**: `http://localhost:3005/api/v1/auth/instagram/login`
- **Server Route**: `/api/auth/instagram/login`
- **Status**: External API integration
- **Required Parameters**:
  - `redirectUri`: `https://c3a9e16357e2.ngrok-free.app`
  - `state`: Random string generated server-side

### Twitter

- **Endpoint**: `/api/auth/twitter/login`
- **Server Route**: `/api/auth/twitter/login`
- **Status**: Placeholder implementation

### Facebook

- **Endpoint**: `/api/auth/facebook/login`
- **Server Route**: `/api/auth/facebook/login`
- **Status**: Placeholder implementation

## Architecture

### Client-Side (UI)

- React components with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- State management with React hooks

### Server-Side (API)

- Next.js API routes
- External API integration for Instagram
- Error handling and response formatting
- TypeScript for type safety

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### POST /api/auth/instagram/login

Connects to external Instagram authentication service at `localhost:3005`

### POST /api/auth/twitter/login

Placeholder Twitter authentication endpoint

### POST /api/auth/facebook/login

Placeholder Facebook authentication endpoint

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- External Instagram service running on localhost:3005 (for Instagram functionality)

### Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── instagram/login/route.ts
│   │   ├── twitter/login/route.ts
│   │   └── facebook/login/route.ts
│   ├── page.tsx
│   └── layout.tsx
└── lib/
    └── api.ts
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Backend**: Next.js API Routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
