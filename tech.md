# KrishiMitra - Technology Stack

## Programming Languages

### JavaScript (ES6+)
- **Version**: ES2020+ features
- **Usage**: Both frontend and backend
- **Key Features Used**:
  - Arrow functions
  - Async/await
  - Destructuring
  - Template literals
  - Spread/rest operators
  - Optional chaining
  - Nullish coalescing

### JSX
- **Usage**: React component markup
- **Extension**: .jsx files for components

## Frontend Technologies

### Core Framework
- **React**: v19.2.4
  - Functional components only
  - Hooks-based state management
  - Context API for global state
  - No class components

### Build Tool
- **Vite**: v8.0.4
  - Fast HMR (Hot Module Replacement)
  - Optimized production builds
  - ES modules support
  - Plugin ecosystem

### UI Framework & Components
- **Tailwind CSS**: v4.2.2
  - Utility-first CSS framework
  - JIT (Just-In-Time) compilation
  - Custom design tokens
  - Mobile-first responsive design

- **shadcn/ui**: v4.2.0
  - Radix UI primitives
  - Accessible components
  - Customizable with Tailwind
  - Copy-paste component model

- **@base-ui/react**: v1.4.0
  - Base UI components

### Routing
- **React Router DOM**: v7.14.1
  - Client-side routing
  - Nested routes
  - Protected routes
  - URL parameters

### State Management
- **@tanstack/react-query**: v5.99.0
  - Server state management
  - Automatic caching
  - Background refetching
  - Optimistic updates
  - Loading/error states

- **React Context API**
  - Global auth state
  - User profile data
  - Language preferences

### HTTP Client
- **Axios**: v1.15.0
  - Promise-based HTTP client
  - Request/response interceptors
  - Automatic JSON transformation
  - Error handling

### Maps & Location
- **@react-google-maps/api**: v2.20.8
  - Google Maps integration
  - Marker clustering
  - Custom overlays

- **Leaflet**: v1.9.4
  - Open-source mapping library
  - Fallback for Google Maps

- **react-leaflet**: v5.0.0
  - React wrapper for Leaflet

### Charts & Visualization
- **Recharts**: v3.8.1
  - React chart library
  - Line charts for price trends
  - Bar charts for rainfall
  - Responsive charts

### Authentication & Backend Services
- **Firebase**: v12.12.0
  - Firebase Authentication (Google + Phone OTP)
  - Cloud Firestore (real-time database)
  - Firebase Storage (image uploads)
  - Firebase Admin SDK (backend)

### PDF Generation
- **jsPDF**: v4.2.1
  - Client-side PDF generation
  - Disease report exports

- **jspdf-autotable**: v5.0.7
  - Table generation for PDFs

### Icons
- **lucide-react**: v1.8.0
  - Modern icon library
  - Tree-shakeable
  - Consistent design

### Utilities
- **class-variance-authority**: v0.7.1
  - Component variant management

- **clsx**: v2.1.1
  - Conditional className utility

- **tailwind-merge**: v3.5.0
  - Merge Tailwind classes intelligently

- **tw-animate-css**: v1.4.0
  - Animation utilities

### Fonts
- **@fontsource-variable/geist**: v5.2.8
  - Modern variable font

## Backend Technologies

### Runtime & Framework
- **Node.js**: v18+ (LTS)
  - JavaScript runtime
  - Event-driven architecture
  - Non-blocking I/O

- **Express**: v4.19.2
  - Web application framework
  - Middleware support
  - RESTful API routing

### AI & Machine Learning
- **groq-sdk**: v0.3.3
  - Groq AI API client
  - LLM inference (Llama 4 Scout)
  - Vision model support

### Backend Services
- **firebase-admin**: v12.2.0
  - Server-side Firebase SDK
  - Firestore operations
  - User management
  - Storage operations

### Security & Middleware
- **cors**: v2.8.5
  - Cross-Origin Resource Sharing
  - Configured for frontend domain

- **helmet**: v8.1.0
  - Security headers
  - XSS protection
  - Content Security Policy

- **express-rate-limit**: v8.3.2
  - API rate limiting
  - DDoS protection

### File Handling
- **multer**: v2.1.1
  - Multipart/form-data handling
  - Image upload processing

### Environment & Configuration
- **dotenv**: v16.4.5
  - Environment variable management
  - .env file loading

### Logging
- **morgan**: v1.10.1
  - HTTP request logger
  - Development and production modes

### Development Tools
- **nodemon**: v3.1.4
  - Auto-restart on file changes
  - Development server

## External APIs

### Government Data
- **data.gov.in (Agmarknet API)**
  - Endpoint: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
  - Authentication: API key (query parameter)
  - Rate Limit: Free tier
  - Data: Mandi prices across India

### Weather
- **Open-Meteo API**
  - Endpoint: `https://api.open-meteo.com/v1/forecast`
  - Authentication: None (completely free)
  - Rate Limit: Unlimited
  - Data: Weather forecasts, historical data

### Plant Disease Detection
- **crop.health API (Kindwise)**
  - Endpoint: `https://crop.health/api/v1/identification`
  - Authentication: Bearer token
  - Rate Limit: 100 identifications/month (free tier)
  - Data: Plant disease identification from images

### AI Inference
- **Groq API**
  - Endpoint: `https://api.groq.com/openai/v1/chat/completions`
  - Authentication: Bearer token
  - Model: `meta-llama/llama-4-scout-17b-16e-instruct`
  - Rate Limit: Generous free tier
  - Features: Text generation, vision analysis

### Maps
- **Google Maps JavaScript API**
  - Authentication: API key
  - Rate Limit: $200 free credit/month
  - Features: Map display, markers, geocoding

### Translation
- **Google Translate**
  - Embedded widget
  - Languages: English, Hindi, Marathi
  - Free tier

## Development Tools

### Code Quality
- **ESLint**: v9.39.4
  - JavaScript linting
  - React-specific rules
  - Custom configuration

- **@eslint/js**: v9.39.4
  - ESLint JavaScript rules

- **eslint-plugin-react-hooks**: v7.0.1
  - React Hooks linting rules

- **eslint-plugin-react-refresh**: v0.5.2
  - React Fast Refresh support

### Build Tools
- **@vitejs/plugin-react**: v6.0.1
  - React support for Vite
  - Fast Refresh

- **@tailwindcss/vite**: v4.2.2
  - Tailwind CSS Vite plugin

### Type Support
- **@types/node**: v25.6.0
  - Node.js type definitions

- **@types/react**: v19.2.14
  - React type definitions

- **@types/react-dom**: v19.2.3
  - React DOM type definitions

### Package Management
- **npm**: v8+
  - Dependency management
  - Script runner

## Development Commands

### Frontend Commands
```bash
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Commands
```bash
# Production server
npm start

# Development server with auto-restart
npm run dev
```

## Environment Variables

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GOOGLE_MAPS_API_KEY=
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)
```
GROQ_API_KEY=
DATA_GOV_IN_API_KEY=
CROP_HEALTH_API_KEY=
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./serviceAccountKey.json
PORT=5000
```

## Browser Support

### Target Browsers
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android 90+

### Required Browser Features
- ES6+ JavaScript
- Fetch API
- LocalStorage
- Geolocation API
- Web Speech API (for voice features)
- Camera API (for disease detection)

## Deployment

### Frontend Deployment (Vercel)
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x
- **Environment**: Production environment variables set in Vercel dashboard

### Backend Deployment (Render)
- **Platform**: Render.com
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Node Version**: 18.x
- **Environment**: Production environment variables set in Render dashboard
- **Free Tier**: 750 hours/month, sleeps after 15 min inactivity

### Database & Services (Firebase)
- **Plan**: Spark (Free)
- **Region**: asia-south1 (Mumbai)
- **Services**: Auth, Firestore, Storage
- **Limits**: 
  - Firestore: 1GB storage, 50K reads/day, 20K writes/day
  - Storage: 5GB, 1GB/day downloads
  - Auth: Unlimited

## Version Control

### Git
- **Repository**: GitHub
- **Branching**: Main branch for production
- **Ignored Files**: 
  - `.env` files
  - `node_modules/`
  - `dist/` (frontend build)
  - `serviceAccountKey.json` (Firebase credentials)
  - `.DS_Store`, `Thumbs.db`

## Design System

### Color Palette
```css
/* Primary Colors */
--primary: #2D6A4F;
--primary-dark: #1B4332;
--primary-light: #D8F3DC;

/* Accent Colors */
--accent: #E76F00;
--accent-light: #FFF3E0;

/* Status Colors */
--danger: #C62828;
--danger-light: #FFEBEE;
--info: #1565C0;
--info-light: #E3F2FD;

/* Neutral Colors */
--surface: #F9FAFB;
--text-primary: #111827;
--text-secondary: #6B7280;
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Heading Sizes**: H1=32px, H2=24px, H3=18px
- **Body Size**: 16px
- **Small Size**: 14px
- **Tiny Size**: 12px
- **Line Height**: 1.6 (body), 1.3 (headings)

### Spacing Scale
- Tailwind default spacing scale (4px base unit)
- Common values: 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

## Performance Optimizations

### Frontend
- Vite code splitting
- React.lazy for route-based code splitting (future)
- Image optimization (WebP format)
- React Query caching
- LocalStorage for user preferences
- Debounced search inputs

### Backend
- Price data caching (reduces API calls)
- Express compression middleware (future)
- Rate limiting to prevent abuse
- Efficient Firestore queries with indexes

## Testing Strategy (Future)

### Frontend Testing
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright or Cypress
- **Component Tests**: Storybook

### Backend Testing
- **Unit Tests**: Jest
- **Integration Tests**: Supertest
- **API Tests**: Postman collections

## Documentation

### Code Documentation
- JSDoc comments for complex functions
- README.md in each major directory
- Inline comments for business logic

### API Documentation
- Backend routes documented in route files
- Postman collection for API testing
- OpenAPI/Swagger spec (future)

## Monitoring & Analytics (Future)

### Error Tracking
- Sentry for error monitoring
- Firebase Crashlytics

### Analytics
- Google Analytics 4
- Firebase Analytics
- Custom event tracking

### Performance Monitoring
- Vercel Analytics
- Firebase Performance Monitoring
- Lighthouse CI

## Security Best Practices

### Frontend Security
- No API keys in client code
- Input sanitization
- XSS prevention via React's built-in escaping
- HTTPS only in production
- Content Security Policy headers

### Backend Security
- Environment variables for secrets
- CORS configuration
- Rate limiting
- Helmet.js security headers
- Firebase security rules
- Input validation
- SQL injection prevention (N/A - using Firestore)

## Accessibility

### WCAG 2.1 Compliance
- Level AA target
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader support
- Color contrast ratios (4.5:1 minimum)

### Accessibility Tools
- shadcn/ui components (built on Radix UI with accessibility)
- Focus management
- Skip navigation links
- Alt text for images
- Form labels and error messages
