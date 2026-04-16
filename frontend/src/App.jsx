import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoginModal from '@/components/LoginModal'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import Prices from '@/pages/Prices'
import CropAdvisor from '@/pages/CropAdvisor'
import DiseaseDetect from '@/pages/DiseaseDetect'
import Weather from '@/pages/Weather'
import Alerts from '@/pages/Alerts'
import Community from '@/pages/Community'
import Schemes from '@/pages/Schemes'
import Profile from '@/pages/Profile'

const queryClient = new QueryClient()

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar onLoginClick={() => setLoginOpen(true)} />
          <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/prices" element={<P><Prices /></P>} />
              <Route path="/crop-advisor" element={<P><CropAdvisor /></P>} />
              <Route path="/disease-detect" element={<P><DiseaseDetect /></P>} />
              <Route path="/weather" element={<P><Weather /></P>} />
              <Route path="/alerts" element={<P><Alerts /></P>} />
              <Route path="/community" element={<P><Community /></P>} />
              <Route path="/schemes" element={<P><Schemes /></P>} />
              <Route path="/profile" element={<P><Profile /></P>} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
