# Blog Website Frontend

A modern blog platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Clerk integration for user sign-up/sign-in
- **Rich Text Editor**: TipTap editor for creating beautiful blog posts
- **Image Upload**: Cloudinary integration for image management
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Interactions**: Like posts, comment, and reply functionality
- **Search**: Full-text search across all blog posts
- **Categories**: Organize posts by categories
- **Trending Posts**: Discover popular content

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Rich Text Editor**: TipTap
- **Image Upload**: Cloudinary
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here

   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:5000

   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Get Clerk credentials**:
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key
   - Update the `.env.local` file

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/[slug]/       # Individual blog post page
│   ├── category/[slug]/   # Category pages
│   ├── search/           # Search results page
│   ├── write/            # Post creation page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable components
│   ├── BlogCard.tsx      # Blog post card
│   ├── CommentSection.tsx # Comments and replies
│   ├── Header.tsx        # Navigation header
│   ├── RichTextEditor.tsx # TipTap editor
│   ├── Sidebar.tsx       # Sidebar with categories
│   └── SimilarPosts.tsx  # Related posts
├── types/               # TypeScript type definitions
│   └── index.ts
└── middleware.ts        # Clerk authentication middleware
```

## Key Components

### Header
- Logo and navigation
- Search functionality
- Authentication buttons
- Write post button

### BlogCard
- Displays post preview
- Author information
- Like functionality
- Category tags
- Read time and stats

### RichTextEditor
- TipTap-based editor
- Toolbar with formatting options
- Image upload support
- Link insertion

### CommentSection
- Nested comments and replies
- Like comments
- Real-time updates

## API Integration

The frontend communicates with the backend API at `http://localhost:5000`:

- **Posts**: CRUD operations for blog posts
- **Comments**: Add, like, and reply to comments
- **Categories**: Fetch and filter by categories
- **Users**: User profiles and authentication
- **Search**: Full-text search functionality

## Authentication Flow

1. Users sign up/sign in using Clerk
2. JWT tokens are sent to backend for verification
3. Protected routes require authentication
4. User profile is synced with backend

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for theming

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms

- Netlify
- Railway
- DigitalOcean App Platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
