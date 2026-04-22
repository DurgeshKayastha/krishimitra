import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/LoginModal'
import {
  TrendingUp, Sprout, Bug, CloudSun, Bell, Users, BookOpen, User, Lock, Mic
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Crop Prices',
    desc: 'Real-time mandi prices from 3000+ markets across India',
    to: '/prices',
    color: 'text-[#E76F00]',
    bg: 'bg-[#FFF3E0]',
    preview: 'See today\'s onion price in Lasalgaon, wheat in Kopargaon, tomato in Pune — updated daily from Agmarknet.',
  },
  {
    icon: Sprout,
    title: 'Crop Advisor',
    desc: 'AI crop recommendations based on your soil & season',
    to: '/crop-advisor',
    color: 'text-[#2D6A4F]',
    bg: 'bg-[#D8F3DC]',
    preview: 'Tell us your soil type and district — our AI suggests the top 5 crops with expected yield and market outlook.',
  },
  {
    icon: Bug,
    title: 'Disease Detect',
    desc: 'Upload a photo and get instant AI diagnosis',
    to: '/disease-detect',
    color: 'text-[#C62828]',
    bg: 'bg-[#FFEBEE]',
    preview: 'Take a photo of your crop. Our AI identifies the disease, severity, and gives organic + chemical remedies.',
  },
  {
    icon: CloudSun,
    title: 'Weather',
    desc: 'Hyperlocal 7-day forecast with farming calendar',
    to: '/weather',
    color: 'text-[#1565C0]',
    bg: 'bg-[#E3F2FD]',
    preview: '7-day rainfall forecast for your exact location with AI-generated farming activity suggestions per day.',
  },
  {
    icon: Bell,
    title: 'Disease Alerts',
    desc: 'Community map of disease outbreaks near you',
    to: '/alerts',
    color: 'text-[#E76F00]',
    bg: 'bg-[#FFF3E0]',
    preview: 'See a live map of disease outbreaks reported by farmers in your district. Report and alert authorities.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'Discuss farming tips, prices and schemes',
    to: '/community',
    color: 'text-[#2D6A4F]',
    bg: 'bg-[#D8F3DC]',
    preview: 'Ask questions, share tips, discuss market prices with farmers from across Maharashtra.',
  },
  {
    icon: BookOpen,
    title: 'Govt Schemes',
    desc: 'PM-KISAN, Fasal Bima, Soil Health Card and more',
    to: '/schemes',
    color: 'text-[#1565C0]',
    bg: 'bg-[#E3F2FD]',
    preview: 'Browse 8+ central and state schemes. Check eligibility, benefits and apply directly from the app.',
  },
  {
    icon: User,
    title: 'My Farm',
    desc: 'Your farm profile, reports and price alerts',
    to: '/profile',
    color: 'text-[#C62828]',
    bg: 'bg-[#FFEBEE]',
    preview: 'Save your farm details, track disease reports you submitted, and set price alerts for your crops.',
  },
  {
    icon: Mic,
    title: 'Voice Assistant',
    desc: 'Ask farming questions by voice in Hindi, Marathi or English',
    to: '/voice-assistant',
    color: 'text-[#2D6A4F]',
    bg: 'bg-[#D8F3DC]',
    preview: 'Speak your question and get instant AI answers with internet search. Works in Hindi, Marathi and English.',
  },
]

const stats = [
  { value: '3000+', label: 'Mandis Tracked' },
  { value: '50+', label: 'Crops Covered' },
  { value: 'Real-time', label: 'Data Updates' },
  { value: 'Free', label: 'Always Free' },
]

function FeatureCard({ feature, onLoginClick }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    if (user) navigate(feature.to)
    else onLoginClick()
  }

  return (
    <div
      className="relative bg-white border border-gray-200 rounded-xl p-5 cursor-pointer overflow-hidden transition-all duration-300 hover:border-[#2D6A4F] hover:shadow-xl hover:-translate-y-1 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* normal state */}
      <div className={`transition-all duration-200 ${hovered ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
        <div className={`w-9 h-9 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
          <feature.icon className={`w-4 h-4 ${feature.color}`} />
        </div>
        <h3 className="font-semibold text-[#111827] mb-1 text-sm">{feature.title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
      </div>

      {/* hover preview overlay */}
      <div className={`absolute inset-0 p-5 flex flex-col justify-between transition-all duration-200 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 100%)' }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <feature.icon className={`w-4 h-4 ${feature.color}`} />
            <span className="text-xs font-semibold text-[#1B4332]">{feature.title}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{feature.preview}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          {user ? (
            <span className="text-xs font-medium text-[#2D6A4F]">Open →</span>
          ) : (
            <>
              <Lock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Sign in to access</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] via-white to-[#f9fafb]">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D8F3DC] to-[#f0fdf4] px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#2D6A4F] rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-[#1B4332]">
                कृषि मित्र — Your Farming Companion
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-[#1B4332] leading-tight mb-6">
              Smart Farming
              <br />
              <span className="bg-gradient-to-r from-[#2D6A4F] to-[#52B788] bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mb-8 leading-relaxed">
              Real-time mandi prices, AI-powered crop advice, instant disease detection, and weather forecasts — all in one place, built for Indian farmers.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Button size="lg" onClick={() => navigate('/prices')}
                    className="bg-gradient-to-r from-[#2D6A4F] to-[#52B788] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    View Mandi Prices
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/crop-advisor')}
                    className="border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#f0fdf4] rounded-lg px-8 transition-all hover:scale-105">
                    Get Crop Advice
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={() => setLoginOpen(true)}
                    className="bg-gradient-to-r from-[#2D6A4F] to-[#52B788] hover:from-[#1B4332] hover:to-[#2D6A4F] text-white rounded-lg px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Get Started — Free Forever
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setLoginOpen(true)}
                    className="border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#f0fdf4] rounded-lg px-8 transition-all hover:scale-105">
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-5 lg:w-80 shrink-0 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            {stats.map((s, idx) => (
              <div key={s.label} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-3xl font-bold bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] bg-clip-text text-transparent">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200" />
      </div>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-3">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive farming tools powered by AI and real-time government data</p>
        </div>
        {!user && (
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Sign in to unlock all features</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.to} feature={f} onLoginClick={() => setLoginOpen(true)} />
          ))}
        </div>
      </section>

      {/* Bottom strip */}
      <section className="border-t border-gray-200 bg-gradient-to-r from-white to-[#f0fdf4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-500">Data from <span className="text-[#1B4332] font-semibold">Agmarknet · Ministry of Agriculture</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-500">AI powered by <span className="text-[#1B4332] font-semibold">Groq · Llama 4</span></span>
          </div>
        </div>
      </section>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
