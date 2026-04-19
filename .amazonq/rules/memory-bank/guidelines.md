# KrishiMitra - Development Guidelines

## Code Quality Standards

### File Naming Conventions
- **React Components**: PascalCase with `.jsx` extension (e.g., `Navbar.jsx`, `LoginModal.jsx`)
- **Hooks**: camelCase with `use` prefix and `.js` extension (e.g., `usePrices.js`, `useWeather.js`)
- **Utilities**: camelCase with `.js` extension (e.g., `api.js`, `utils.js`, `firebase.js`)
- **Backend Routes**: lowercase with `.js` extension (e.g., `prices.js`, `groq.js`)
- **Backend Services**: camelCase with `.js` extension (e.g., `priceCache.js`)

### Code Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Aim for 80-100 characters, max 120 characters
- **Semicolons**: Optional in frontend (consistent omission), required in backend
- **Quotes**: Single quotes for strings in frontend, single quotes in backend
- **Trailing Commas**: Used in multi-line arrays and objects
- **Arrow Functions**: Preferred over function expressions
- **Template Literals**: Used for string interpolation

### Import Organization
```javascript
// 1. External dependencies (React, third-party libraries)
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal modules with @ alias
import { useAuth } from '@/context/AuthContext'
import { getPrices } from '@/lib/api'

// 3. Relative imports (if needed)
import './styles.css'
```

### ESLint Configuration
- **ECMAScript Version**: ES2020+
- **Environment**: Browser globals for frontend, Node.js for backend
- **Rules**:
  - `no-unused-vars`: Error with exception for uppercase variables (constants)
  - React Hooks rules enforced
  - React Fast Refresh rules enabled
- **Ignored Directories**: `dist/`, `node_modules/`

## React Component Patterns

### Functional Components Only
```javascript
// ✅ CORRECT: Functional component with hooks
export default function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null)
  
  useEffect(() => {
    // side effects
  }, [])
  
  return <div>{/* JSX */}</div>
}

// ❌ AVOID: Class components
class MyComponent extends React.Component { }
```

### Component Structure
```javascript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Component definition
export default function ComponentName({ prop1, prop2 }) {
  // 3. Hooks (in order: state, context, queries, effects)
  const [localState, setLocalState] = useState(null)
  const { user } = useAuth()
  const { data, isLoading } = useQuery(...)
  
  useEffect(() => {
    // effects
  }, [])
  
  // 4. Event handlers
  const handleClick = () => {
    // logic
  }
  
  // 5. Conditional rendering logic
  if (isLoading) return <LoadingState />
  if (!data) return <ErrorState />
  
  // 6. JSX return
  return (
    <div className="container">
      {/* content */}
    </div>
  )
}
```

### Props Destructuring
```javascript
// ✅ CORRECT: Destructure props in function signature
function Button({ children, onClick, variant = 'primary' }) {
  return <button onClick={onClick}>{children}</button>
}

// ❌ AVOID: Accessing props object
function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### Default Props
```javascript
// ✅ CORRECT: Default values in destructuring
function Separator({ orientation = 'horizontal', className }) {
  // ...
}
```

## State Management Patterns

### Local State with useState
```javascript
// Simple state
const [count, setCount] = useState(0)

// Object state (prefer multiple useState for unrelated data)
const [form, setForm] = useState({ name: '', email: '' })

// Update object state immutably
setForm(prev => ({ ...prev, name: 'New Name' }))
```

### Global State with Context
```javascript
// Context definition
const AuthContext = createContext(null)

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // ... logic
  
  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for consuming context
export const useAuth = () => useContext(AuthContext)
```

### Server State with React Query
```javascript
// Custom hook pattern
export function usePrices(params) {
  return useQuery({
    queryKey: ['prices', params],
    queryFn: () => getPrices(params).then((r) => r.data),
    enabled: !!params?.state,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Usage in component
const { data, isLoading, error } = usePrices({ state: 'Maharashtra' })
```

## Custom Hooks Patterns

### Hook Naming
- Always start with `use` prefix
- Descriptive name indicating purpose
- Return object with named properties or array for simple cases

### Hook Structure
```javascript
import { useQuery } from '@tanstack/react-query'
import { getPrices } from '@/lib/api'

export function usePrices(params) {
  return useQuery({
    queryKey: ['prices', params],
    queryFn: () => getPrices(params).then((r) => r.data),
    enabled: !!params?.state,
    staleTime: 1000 * 60 * 10,
  })
}
```

### Conditional Execution
```javascript
// Use 'enabled' option to conditionally run queries
useQuery({
  queryKey: ['data', id],
  queryFn: () => fetchData(id),
  enabled: !!id, // Only run when id exists
})
```

## Styling Patterns

### Tailwind CSS Classes
```javascript
// ✅ CORRECT: Utility classes for styling
<div className="min-h-screen flex items-center justify-center">
  <div className="w-7 h-7 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
</div>

// Use custom colors with bracket notation
<button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white">
  Click me
</button>
```

### Class Merging with cn Utility
```javascript
import { cn } from '@/lib/utils'

function Component({ className }) {
  return (
    <div className={cn(
      "base-classes here",
      "more-base-classes",
      className // user-provided classes override
    )}>
      {/* content */}
    </div>
  )
}
```

### Responsive Design
```javascript
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Responsive width */}
</div>

// Conditional rendering for mobile
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

### shadcn/ui Component Usage
```javascript
// Import from ui directory
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Use with custom classes
<Button className="bg-[#2D6A4F]">
  Custom styled button
</Button>

// Spread props pattern
function CustomButton({ className, ...props }) {
  return (
    <Button
      className={cn("custom-base-classes", className)}
      {...props}
    />
  )
}
```

## Routing Patterns

### Route Definition
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/prices" element={<Prices />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Protected Routes
```javascript
// Wrapper component pattern
const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

<Route path="/profile" element={<P><Profile /></P>} />
```

### Lazy Loading
```javascript
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('@/pages/Home'))

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Suspense>
```

## API Integration Patterns

### Axios Instance Configuration
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor for error normalization
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      (err.code === 'ERR_NETWORK' ? 'Cannot connect to server.' : null) ||
      err.message ||
      'Something went wrong'
    
    return Promise.reject(new Error(message))
  }
)
```

### API Function Definitions
```javascript
// Named exports for specific endpoints
export const getPrices = (params) => api.get('/api/prices', { params })
export const postGroq = (payload) => api.post('/api/groq', payload)

// Special handling for file uploads
export const postDisease = (formData) => api.post('/api/disease', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 60000, // longer timeout for heavy operations
})
```

## Backend Patterns

### Express Server Structure
```javascript
require('dotenv').config()
const express = require('express')
const app = express()

// 1. Security middleware
app.use(helmet())

// 2. CORS configuration
app.use(cors({ origin: ALLOWED_ORIGINS }))

// 3. Body parsing
app.use(express.json({ limit: '2mb' }))

// 4. Logging
app.use(morgan('[:date[iso]] :method :url :status :response-time ms'))

// 5. Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

// 6. Routes
app.use('/api/prices', require('./routes/prices'))

// 7. Error handling
app.use(errorHandler)

// 8. Start server
app.listen(PORT, () => console.log(`Server on port ${PORT}`))
```

### Route Handler Pattern
```javascript
const express = require('express')
const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { param1, param2 } = req.body
    
    // Validation
    if (!param1) {
      return res.status(400).json({ error: 'param1 is required' })
    }
    
    // Business logic
    const result = await someAsyncOperation(param1, param2)
    
    // Response
    res.json({ data: result })
  } catch (err) {
    next(err) // Pass to error handler
  }
})

module.exports = router
```

### Singleton Pattern for External Clients
```javascript
// Groq client singleton
let groqClient = null
function getGroq() {
  if (!groqClient) groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return groqClient
}

// Usage
const completion = await getGroq().chat.completions.create({ ... })
```

### Input Validation and Sanitization
```javascript
// Validate array input
if (!Array.isArray(messages) || messages.length === 0) {
  return res.status(400).json({ error: 'messages array is required' })
}

// Limit array size
if (messages.length > MAX_MESSAGES) {
  return res.status(400).json({ error: `Maximum ${MAX_MESSAGES} messages allowed` })
}

// Sanitize and truncate strings
const sanitized = messages.map(m => ({
  role: ['user', 'assistant', 'system'].includes(m.role) ? m.role : 'user',
  content: typeof m.content === 'string'
    ? m.content.slice(0, MAX_MESSAGE_LENGTH)
    : m.content,
}))
```

### Error Handling
```javascript
// Specific error handling
if (err.status === 429) {
  return res.status(429).json({ error: 'AI service is busy. Please try again in a moment.' })
}

// Pass to global error handler
next(err)
```

## Firebase Integration Patterns

### Firebase Initialization
```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other config
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

### Authentication Patterns
```javascript
// Google Sign-In
const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

// Phone OTP with reCAPTCHA cleanup
function destroyRecaptcha() {
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = null
    }
  } catch {}
  // Recreate container for fresh render
  const old = document.getElementById('recaptcha-container')
  if (old) {
    const parent = old.parentNode
    parent.removeChild(old)
    const fresh = document.createElement('div')
    fresh.id = 'recaptcha-container'
    parent.appendChild(fresh)
  }
}

const sendOTP = async (phoneNumber) => {
  destroyRecaptcha()
  const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
  })
  window.recaptchaVerifier = verifier
  return signInWithPhoneNumber(auth, phoneNumber, verifier)
}
```

### Firestore Operations
```javascript
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

// Create or update document
const ref = doc(db, 'users', userId)
await setDoc(ref, {
  uid: userId,
  displayName: 'John Doe',
  createdAt: serverTimestamp(),
})

// Read document
const snap = await getDoc(ref)
if (snap.exists()) {
  const data = snap.data()
}
```

### Auth State Listener
```javascript
useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // User signed in
      const ref = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(ref)
      
      // Create user document if doesn't exist
      if (!snap.exists()) {
        await setDoc(ref, { /* initial data */ })
      }
      
      setUser({ ...firebaseUser, profile: snap.data() || {} })
    } else {
      // User signed out
      setUser(null)
    }
    setLoading(false)
  })
  return unsub // Cleanup
}, [])
```

## Environment Variables

### Frontend (.env)
```bash
# Prefix all frontend env vars with VITE_
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (.env)
```bash
# No prefix needed for backend
GROQ_API_KEY=your_key_here
DATA_GOV_IN_API_KEY=your_key_here
PORT=5000
```

### Accessing Environment Variables
```javascript
// Frontend (Vite)
const apiUrl = import.meta.env.VITE_BACKEND_URL

// Backend (Node.js)
const apiKey = process.env.GROQ_API_KEY
```

## Error Handling Patterns

### Frontend Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### Try-Catch in Async Operations
```javascript
try {
  const result = await someAsyncOperation()
  // handle success
} catch (error) {
  console.error('Operation failed:', error)
  // handle error (show toast, set error state, etc.)
}
```

### Backend Error Handler Middleware
```javascript
// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('[Error]', err.message)
  
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  
  res.status(status).json({ error: message })
}
```

## Performance Optimization Patterns

### React Query Configuration
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Lazy Loading Components
```javascript
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('@/pages/Home'))

<Suspense fallback={<PageLoader />}>
  <Home />
</Suspense>
```

### Memoization (Use Sparingly)
```javascript
import { useMemo, useCallback } from 'react'

// Expensive computation
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// Callback stability
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])
```

## Testing Patterns (Future Implementation)

### Component Testing Structure
```javascript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Documentation Patterns

### JSDoc Comments for Complex Functions
```javascript
/**
 * Fetches crop prices from Agmarknet API
 * @param {Object} params - Query parameters
 * @param {string} params.state - State name
 * @param {string} params.district - District name
 * @param {string} params.commodity - Commodity name
 * @returns {Promise<Array>} Array of price records
 */
export const getPrices = (params) => api.get('/api/prices', { params })
```

### Inline Comments for Business Logic
```javascript
// Schedule daily refresh at midnight IST (18:30 UTC)
const now = new Date()
const midnight = new Date()
midnight.setUTCHours(18, 30, 0, 0)
if (midnight < now) midnight.setDate(midnight.getDate() + 1)
const msUntilMidnight = midnight - now
```

## Common Idioms and Patterns

### Optional Chaining
```javascript
// Safe property access
const userName = user?.profile?.displayName || 'Guest'

// Safe method calls
const result = api.getData?.()
```

### Nullish Coalescing
```javascript
// Use ?? for null/undefined checks (not falsy checks)
const port = process.env.PORT ?? 5000
const name = user.name ?? 'Anonymous'
```

### Array Filtering with Boolean
```javascript
// Remove falsy values from array
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)
```

### Spread Operator for Props
```javascript
// Pass all remaining props
function Component({ className, ...props }) {
  return <div className={className} {...props} />
}
```

### Short-Circuit Evaluation
```javascript
// Conditional rendering
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}
```

### Ternary for Conditional Values
```javascript
// Conditional class names
<div className={isActive ? 'active' : 'inactive'}>

// Conditional rendering
{user ? <Dashboard /> : <Login />}
```

## Security Best Practices

### Never Expose API Keys in Frontend
```javascript
// ❌ WRONG: API key in frontend code
const apiKey = 'sk-1234567890'

// ✅ CORRECT: API calls through backend proxy
const result = await api.post('/api/groq', { messages })
```

### Input Validation
```javascript
// Validate all user inputs
if (!email || !email.includes('@')) {
  return res.status(400).json({ error: 'Invalid email' })
}

// Sanitize strings
const sanitized = userInput.trim().slice(0, MAX_LENGTH)
```

### CORS Configuration
```javascript
// Whitelist specific origins
const ALLOWED_ORIGINS = ['http://localhost:5173', process.env.FRONTEND_URL]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(`CORS blocked: ${origin}`))
  },
}))
```

### Rate Limiting
```javascript
// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
}))

// Stricter limits for expensive operations
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
})
app.use('/api/groq', aiLimiter, require('./routes/groq'))
```

## Accessibility Patterns

### Semantic HTML
```javascript
// Use semantic elements
<nav>...</nav>
<main>...</main>
<footer>...</footer>
<article>...</article>
```

### ARIA Labels
```javascript
// Add labels for screen readers
<button aria-label="Close modal">×</button>
<input aria-label="Search" placeholder="Search..." />
```

### Keyboard Navigation
```javascript
// Ensure interactive elements are keyboard accessible
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
  Click me
</div>
```

## Git Commit Patterns

### Commit Message Format
```
type(scope): brief description

- Detailed change 1
- Detailed change 2
```

### Common Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Formatting changes
- `docs`: Documentation updates
- `test`: Test additions/updates
- `chore`: Build/config changes

### Examples
```
feat(prices): add price trend chart
fix(auth): resolve phone OTP verification issue
refactor(api): extract axios interceptor logic
docs(readme): update installation instructions
```
