import { useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoginModal from '@/components/LoginModal'
import ProtectedRoute from '@/components/ProtectedRoute'
import ErrorBoundary from '@/components/ErrorBoundary'

// lazy load pages — reduces initial bundle size
const Home = lazy(() => import('@/pages/Home'))
const Prices = lazy(() => import('@/pages/Prices'))
const CropAdvisor = lazy(() => import('@/pages/CropAdvisor'))
const DiseaseDetect = lazy(() => import('@/pages/DiseaseDetect'))
const Weather = lazy(() => import('@/pages/Weather'))
const Alerts = lazy(() => import('@/pages/Alerts'))
const Community = lazy(() => import('@/pages/Community'))
const Schemes = lazy(() => import('@/pages/Schemes'))
const VoiceAssistant = lazy(() => import('@/pages/VoiceAssistant'))
const Profile = lazy(() => import('@/pages/Profile'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Navbar onLoginClick={() => setLoginOpen(true)} />
            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/prices" element={<P><Prices /></P>} />
                  <Route path="/crop-advisor" element={<P><CropAdvisor /></P>} />
                  <Route path="/disease-detect" element={<P><DiseaseDetect /></P>} />
                  <Route path="/weather" element={<P><Weather /></P>} />
                  <Route path="/alerts" element={<P><Alerts /></P>} />
                  <Route path="/community" element={<P><Community /></P>} />
                  <Route path="/schemes" element={<P><Schemes /></P>} />
                  <Route path="/voice-assistant" element={<P><VoiceAssistant /></P>} />
                  <Route path="/profile" element={<P><Profile /></P>} />
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
                        <p className="text-gray-500 mb-4">Page not found</p>
                        <a href="/" className="text-[#2D6A4F] hover:underline text-sm">Go home</a>
                      </div>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
