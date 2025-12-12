# Politze - Project Summary

## Overview
Politze is a Next.js-based web application designed to raise awareness about political candidates and elected officials in Brazil. It provides transparency data, rankings, news, and event information to help citizens make informed decisions.

## Key Features Implemented

### 1. Authentication System
- **NextAuth.js** integration with Google and Facebook OAuth providers
- Session management with Prisma adapter
- User profile with location information

### 2. Database Schema (Prisma)
- **User**: User accounts with authentication
- **Account & Session**: OAuth account management
- **Politician**: Comprehensive politician profiles with transparency data
- **Rating**: User ratings for politicians
- **News**: Political news articles
- **Event**: Public events and protests
- Seed script included for sample data

### 3. Pages

#### Home Page (`pages/index.tsx`)
- Hero section with call-to-action
- Top-ranked politicians display
- Region-based politician filtering
- Statistics dashboard
- Recent news section
- Upcoming events section
- Fully responsive design

#### Politicians Pages
- **List Page** (`pages/politicians/index.tsx`):
  - Search by name or party
  - Filter by state
  - Grid display with ranking badges
  - Transparency stats preview
  
- **Detail Page** (`pages/politicians/[id].tsx`):
  - Full politician profile
  - Transparency data (proposals, presence rate, budget)
  - Biography
  - User ratings
  - Related news
  - Contact information

#### News Page (`pages/news.tsx`)
- List of political news articles
- Source attribution
- Related politician links
- Tag-based categorization

#### Events Page (`pages/events.tsx`)
- Upcoming protests and public events
- Event details (date, location, organizer)
- Tag-based categorization

### 4. API Routes
- `/api/politicians` - List politicians with filters
- `/api/politicians/[id]` - Get single politician details
- `/api/news` - Fetch news articles
- `/api/events` - Get upcoming events
- `/api/auth/[...nextauth]` - Authentication endpoints

### 5. UI/UX
- Modern, responsive design with Tailwind CSS v4
- Custom color scheme (primary blue palette)
- Gradient backgrounds and card-based layouts
- Smooth hover effects and transitions
- Custom scrollbars
- Mobile-first approach

### 6. Layout
- Persistent header with navigation
- User authentication status display
- Footer with links and information
- Consistent branding (Politze logo with yellow accent)

## Technical Stack

### Frontend
- **Next.js 16** with Pages Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **React 19** for UI components

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma 7** as ORM
- **PostgreSQL** database
- **NextAuth.js** for authentication

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type checking
- **Prisma CLI** for database management
- **ts-node** for seed scripts

## Environment Configuration

Required environment variables:
```
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_URL             # Application URL
NEXTAUTH_SECRET          # Secret for JWT encryption
GOOGLE_CLIENT_ID         # Google OAuth credentials
GOOGLE_CLIENT_SECRET
FACEBOOK_CLIENT_ID       # Facebook OAuth credentials
FACEBOOK_CLIENT_SECRET
```

## Database Models

### Core Models
1. **Politician** - Complete politician profiles with:
   - Personal information (name, party, position, region)
   - Transparency data (budget, proposals, presence rate)
   - Ranking score and position

2. **User** - Application users with:
   - Authentication details
   - Location information
   - Ratings relationship

3. **News** - Political news with:
   - Content and metadata
   - Source attribution
   - Politician association

4. **Event** - Public events with:
   - Event details
   - Location and date
   - Organizer information

5. **Rating** - User ratings for politicians with scores and comments

## Build & Deployment

### Development
```bash
npm run dev          # Start development server (port 3000)
npx prisma studio    # Open database GUI
npx prisma migrate dev # Run database migrations
```

### Production
```bash
npm run build        # Create optimized production build
npm start            # Start production server
```

### Database Setup
```bash
npx prisma migrate dev --name init  # Initialize database
npx prisma db seed                   # Populate with sample data
```

## File Structure
```
politze/
├── components/
│   └── layout/
│       └── Layout.tsx           # Main layout component
├── lib/
│   └── prisma.ts               # Prisma client instance
├── pages/
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── politicians/
│   │   ├── news.ts
│   │   └── events.ts
│   ├── politicians/            # Politician pages
│   ├── index.tsx               # Home page
│   ├── news.tsx                # News listing
│   ├── events.tsx              # Events listing
│   ├── _app.tsx                # App wrapper
│   └── _document.tsx           # HTML document
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── styles/
│   └── globals.css             # Global styles with Tailwind
├── types/
│   └── next-auth.d.ts          # NextAuth type extensions
└── public/                     # Static assets
```

## Next Steps for Production

1. **Database**: Set up PostgreSQL database (Railway, Supabase, or Neon)
2. **OAuth**: Configure Google and Facebook OAuth apps
3. **Environment**: Set production environment variables
4. **Deploy**: Deploy to Vercel or similar platform
5. **Data**: Populate database with real politician data
6. **Testing**: Add comprehensive tests
7. **Monitoring**: Set up error tracking and analytics
8. **SEO**: Add meta tags and sitemap
9. **Performance**: Optimize images and implement caching
10. **Accessibility**: Ensure WCAG compliance

## Security Considerations

- Environment variables are properly secured
- NextAuth handles authentication securely
- Prisma provides SQL injection protection
- CORS and CSRF protection via Next.js
- Session management via secure cookies

## Performance Optimizations

- Static page generation where possible
- Server-side rendering for dynamic content
- Database query optimization with Prisma
- Image optimization ready (Next.js Image component compatible)
- Responsive design for all screen sizes

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App ready

## License

ISC License - See LICENSE file for details

---

Built with ❤️ for promoting political transparency in Brazil
