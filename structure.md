# KrishiMitra - Project Structure

## Project Organization

KrishiMitra follows a monorepo structure with separate frontend and backend applications:

```
college_farmer_something_like_that/
├── frontend/          # React Vite application
├── backend/           # Node.js Express API server
├── .amazonq/          # Amazon Q configuration and rules
├── .dist/             # Distribution artifacts
├── .gitignore         # Git ignore rules
├── KrishiMitra_PRD.txt           # Product Requirements Document
└── NexusAi_Terrabytes.pptx       # Project presentation
```

## Frontend Structure

### Directory Layout
```
frontend/
├── public/                    # Static assets
│   ├── favicon.svg           # App icon
│   └── icons.svg             # Icon sprite sheet
├── src/
│   ├── assets/               # Images and media
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/           # Reusable React components
│   │   ├── ui/              # shadcn/ui component library
│   │   │   ├── alert-dialog.jsx
│   │   │   ├── avatar.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── input.jsx
│   │   │   ├── progress.jsx
│   │   │   ├── select.jsx
│   │   │   ├── separator.jsx
│   │   │   ├── sheet.jsx
│   │   │   ├── skeleton.jsx
│   │   │   ├── table.jsx
│   │   │   ├── tabs.jsx
│   │   │   └── textarea.jsx
│   │   ├── ErrorBoundary.jsx    # Error handling wrapper
│   │   ├── Footer.jsx           # App footer
│   │   ├── LoginModal.jsx       # Authentication modal
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── ProtectedRoute.jsx   # Auth-protected route wrapper
│   ├── context/              # React Context providers
│   │   └── AuthContext.jsx   # Firebase authentication state
│   ├── hooks/                # Custom React hooks
│   │   ├── useLocation.js    # Geolocation hook
│   │   ├── usePrices.js      # Agmarknet price data hook
│   │   └── useWeather.js     # Weather data hook
│   ├── lib/                  # Utility libraries
│   │   ├── api.js           # Axios API client
│   │   ├── firebase.js      # Firebase initialization
│   │   └── utils.js         # Helper functions
│   ├── pages/                # Route page components
│   │   ├── Alerts.jsx        # Disease alert map
│   │   ├── Community.jsx     # Forum/discussion board
│   │   ├── CropAdvisor.jsx   # Crop recommendation wizard
│   │   ├── DiseaseDetect.jsx # Plant disease detection
│   │   ├── Home.jsx          # Landing page
│   │   ├── Prices.jsx        # Mandi price dashboard
│   │   ├── Profile.jsx       # User farm profile
│   │   ├── Schemes.jsx       # Government schemes directory
│   │   ├── VoiceAssistant.jsx # Voice interaction interface
│   │   └── Weather.jsx       # Weather forecast & calendar
│   ├── App.css               # Global app styles
│   ├── App.jsx               # Root component with routing
│   ├── index.css             # Tailwind CSS imports
│   └── main.jsx              # React entry point
├── .env                      # Environment variables (VITE_*)
├── .gitignore               # Git ignore rules
├── components.json          # shadcn/ui configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML entry point
├── jsconfig.json            # JavaScript configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Dependency lock file
├── README.md                # Frontend documentation
└── vite.config.js           # Vite build configuration
```

### Component Architecture

#### UI Components (`components/ui/`)
Auto-generated shadcn/ui components providing:
- Consistent design system
- Accessibility compliance
- Tailwind CSS styling
- Radix UI primitives

#### Layout Components (`components/`)
- **Navbar**: Fixed top navigation with logo, links, language selector, auth button
- **Footer**: Site footer with links and credits
- **LoginModal**: Firebase authentication dialog (Google + Phone OTP)
- **ErrorBoundary**: Catches and displays React errors gracefully
- **ProtectedRoute**: HOC for auth-required pages

#### Page Components (`pages/`)
Each page is a full-screen route component:
- **Home**: Landing page with hero, feature cards, stats
- **Prices**: Market price dashboard with filters, table, charts, AI insights
- **CropAdvisor**: Multi-step wizard for crop recommendations
- **DiseaseDetect**: Image upload and AI disease diagnosis
- **Weather**: Current conditions, 7-day forecast, farming calendar
- **Alerts**: Interactive map of disease outbreaks
- **Community**: Forum with posts, comments, upvotes
- **Schemes**: Government scheme directory
- **Profile**: User farm data and settings
- **VoiceAssistant**: Voice-based query interface

#### Custom Hooks (`hooks/`)
- **useLocation**: Browser geolocation with fallback
- **usePrices**: Fetches and caches Agmarknet price data
- **useWeather**: Fetches Open-Meteo weather forecasts

#### Context Providers (`context/`)
- **AuthContext**: Firebase authentication state management, user profile, login/logout methods

#### Library Utilities (`lib/`)
- **firebase.js**: Firebase SDK initialization (Auth, Firestore, Storage)
- **api.js**: Axios instance configured for backend API calls
- **utils.js**: Helper functions (date formatting, number formatting, validation)

## Backend Structure

### Directory Layout
```
backend/
├── data/                     # Cached data
│   └── prices_cache.json    # Agmarknet price cache
├── middleware/               # Express middleware
│   └── errorHandler.js      # Global error handler
├── routes/                   # API route handlers
│   ├── disease.js           # Disease detection proxy
│   ├── groq.js              # Groq AI proxy
│   ├── prices.js            # Agmarknet price proxy
│   ├── reports.js           # Firestore report operations
│   ├── voice.js             # Voice assistant endpoint
│   └── weather.js           # Weather API proxy
├── services/                 # Business logic
│   └── priceCache.js        # Price caching service
├── .env                      # Environment variables
├── package.json             # Dependencies and scripts
├── package-lock.json        # Dependency lock file
└── server.js                # Express app entry point
```

### API Route Architecture

#### `/api/prices` (prices.js)
- Proxies data.gov.in Agmarknet API
- Handles CORS restrictions
- Implements caching to reduce API calls
- Filters by state, district, commodity, date

#### `/api/groq` (groq.js)
- Proxies Groq AI API
- Handles all LLM inference requests
- Supports multiple use cases:
  - Price insights
  - Crop recommendations
  - Disease report generation
  - Weather-based farming calendar
  - Voice query responses

#### `/api/disease` (disease.js)
- Proxies crop.health API (Kindwise)
- Handles image upload and analysis
- Fallback to Groq vision model if quota exceeded
- Returns disease name, confidence, treatment

#### `/api/weather` (weather.js)
- Proxies Open-Meteo API (optional, can call directly from frontend)
- Formats weather data for frontend consumption

#### `/api/reports` (reports.js)
- Firestore operations for disease reports
- Creates new reports with geolocation
- Updates report status (for agricultural officers)
- Queries reports for map display

#### `/api/voice` (voice.js)
- Processes voice transcriptions
- Routes to appropriate Groq prompts
- Returns voice-friendly responses

### Middleware
- **errorHandler.js**: Catches all errors, logs them, returns consistent error responses
- **CORS**: Configured to allow frontend origin
- **Helmet**: Security headers
- **Morgan**: HTTP request logging
- **Express Rate Limit**: API rate limiting

### Services
- **priceCache.js**: Implements time-based caching for Agmarknet data to stay within API limits

## Architectural Patterns

### Frontend Patterns

#### Component Composition
- Small, single-responsibility components
- Composition over inheritance
- Props for configuration, children for content

#### State Management
- React Context for global state (auth)
- React Query (@tanstack/react-query) for server state
- Local state (useState) for UI state
- No Redux (unnecessary complexity for this scale)

#### Data Fetching
- Custom hooks abstract API calls
- React Query handles caching, loading, error states
- Optimistic updates for better UX

#### Routing
- React Router v6 with declarative routes
- Protected routes via wrapper component
- Lazy loading for code splitting (future optimization)

#### Styling
- Tailwind CSS utility-first approach
- shadcn/ui for component base
- CSS variables for theming
- Mobile-first responsive design

### Backend Patterns

#### API Proxy Pattern
- Backend acts as proxy for government APIs
- Solves CORS issues
- Centralizes API key management
- Enables caching and rate limiting

#### Service Layer
- Business logic separated from route handlers
- Reusable services (e.g., priceCache)
- Easier testing and maintenance

#### Error Handling
- Centralized error middleware
- Consistent error response format
- Proper HTTP status codes

### Data Flow

#### Price Dashboard Flow
```
User → Prices.jsx → usePrices hook → api.js (axios) 
→ Backend /api/prices → data.gov.in API → Cache → Response
→ React Query cache → UI update
```

#### Disease Detection Flow
```
User uploads image → DiseaseDetect.jsx → api.js 
→ Backend /api/disease → crop.health API → Response
→ Backend /api/groq → Groq AI → Enhanced report
→ Firebase Storage (image) → Firestore (report) → UI update
```

#### Authentication Flow
```
User clicks login → LoginModal → AuthContext 
→ Firebase Auth (Google/Phone) → User object
→ Firestore /users/{uid} → Context update → UI update
```

## Core Relationships

### Frontend ↔ Backend
- Frontend makes all API calls through backend proxy
- Backend handles authentication via Firebase Admin SDK
- Real-time data via Firestore (direct from frontend)

### Firebase Integration
- **Auth**: User authentication and session management
- **Firestore**: Real-time database for posts, reports, user profiles
- **Storage**: Image storage for disease reports and forum posts

### External APIs
- **data.gov.in**: Government mandi price data
- **Open-Meteo**: Weather forecasts (no key required)
- **crop.health**: Plant disease identification
- **Groq**: AI inference for all LLM features
- **Google Maps**: Map display for disease alerts

## Configuration Files

### Frontend Configuration
- **vite.config.js**: Vite build settings, path aliases, plugins
- **eslint.config.js**: Code linting rules
- **jsconfig.json**: JavaScript path resolution
- **components.json**: shadcn/ui component configuration
- **.env**: Environment variables (Firebase config, API URLs)

### Backend Configuration
- **package.json**: Scripts (start, dev), dependencies
- **.env**: API keys, Firebase service account path, port

## Deployment Architecture

### Production Setup
```
User Browser
    ↓
Vercel (Frontend - Static React App)
    ↓
Render.com (Backend - Node.js API)
    ↓
├── Firebase (Auth, Firestore, Storage)
├── data.gov.in (Agmarknet API)
├── Open-Meteo (Weather API)
├── crop.health (Disease Detection API)
└── Groq (AI Inference API)
```

### Development Setup
```
localhost:5173 (Vite Dev Server - Frontend)
    ↓
localhost:5000 (Express Server - Backend)
    ↓
[Same external services as production]
```

## Security Considerations

### Frontend Security
- No API keys in client code
- Firebase security rules enforce data access
- Protected routes require authentication
- Input validation on all forms

### Backend Security
- Environment variables for all secrets
- CORS restricted to frontend domain
- Rate limiting on all endpoints
- Helmet.js security headers
- Firebase Admin SDK for server-side auth verification

## Scalability Considerations

### Current Scale
- Designed for 100-1000 concurrent users
- Free tier limits sufficient for college project/hackathon

### Future Scaling
- Add Redis for backend caching
- Implement CDN for static assets
- Database indexing for Firestore queries
- Upgrade to paid tiers for APIs
- Add load balancing for backend
