import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Leaf, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const navLinks = [
  { to: '/prices', label: 'Prices' },
  { to: '/crop-advisor', label: 'Crop Advisor' },
  { to: '/disease-detect', label: 'Disease Detect' },
  { to: '/weather', label: 'Weather' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/community', label: 'Community' },
  { to: '/schemes', label: 'Schemes' },
  { to: '/voice-assistant', label: '🎙 Assistant' },
]

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
]

export default function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [lang, setLang] = useState(() => localStorage.getItem('km_lang') || 'en')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('km_lang')
    if (saved && saved !== 'en') {
      const interval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo')
        if (select) {
          select.value = saved
          select.dispatchEvent(new Event('change'))
          clearInterval(interval)
        }
      }, 500)
      setTimeout(() => clearInterval(interval), 5000)
    }
  }, [])

  const handleLang = (code) => {
    setLang(code)
    localStorage.setItem('km_lang', code)
    const select = document.querySelector('.goog-te-combo')
    if (select) {
      select.value = code
      select.dispatchEvent(new Event('change'))
    }
  }

  const isActive = (to) => location.pathname === to

  return (
    <nav className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white fixed top-0 w-full z-50 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:scale-105 transition-transform">
          <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#1B4332]" />
          </div>
          <span className="hidden sm:inline">KrishiMitra</span>
        </Link>

        {/* Desktop nav — only show when logged in */}
        {user && (
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(l.to) 
                    ? 'bg-white/20 text-white shadow-md' 
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language dropdown */}
          <Select value={lang} onValueChange={handleLang}>
            <SelectTrigger className="w-[140px] h-9 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-white/30 hover:ring-white/60 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-[#52B788] to-[#2D6A4F] text-white text-sm font-semibold">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={onLoginClick}
              className="bg-white text-[#1B4332] hover:bg-gray-100 font-semibold shadow-md transition-all hover:scale-105"
            >
              Login
            </Button>
          )}

          {/* Mobile hamburger — only show when logged in */}
          {user && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <div
                  className="lg:hidden text-white hover:bg-white/20 p-2 rounded-md cursor-pointer transition-colors"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white border-[#2D6A4F] w-72">
                <div className="flex flex-col gap-3 mt-8">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive(l.to) 
                          ? 'bg-white/20 shadow-md' 
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <div className="mt-6 px-4">
                    <p className="text-xs text-gray-300 mb-2">Language</p>
                    <Select value={lang} onValueChange={handleLang}>
                      <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            <span className="flex items-center gap-2">
                              <span>{l.flag}</span>
                              <span>{l.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  )
}
