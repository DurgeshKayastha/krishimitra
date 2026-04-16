import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Leaf } from 'lucide-react'
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

const navLinks = [
  { to: '/prices', label: 'Prices' },
  { to: '/crop-advisor', label: 'Crop Advisor' },
  { to: '/disease-detect', label: 'Disease Detect' },
  { to: '/weather', label: 'Weather' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/community', label: 'Community' },
  { to: '/schemes', label: 'Schemes' },
]

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'mr', label: 'म' },
]

export default function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [lang, setLang] = useState(() => localStorage.getItem('km_lang') || 'en')
  const [open, setOpen] = useState(false)

  const handleLang = (code) => {
    setLang(code)
    localStorage.setItem('km_lang', code)
  }

  const isActive = (to) => location.pathname === to

  return (
    <nav className="bg-[#1B4332] text-white fixed top-0 w-full z-50 border-b border-[#2D6A4F]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-base tracking-tight">
          <Leaf className="w-5 h-5 text-[#D8F3DC]" />
          <span>KrishiMitra</span>
        </Link>

        {/* Desktop nav — only show when logged in */}
        {user && (
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  isActive(l.to) ? 'bg-[#2D6A4F] text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="hidden sm:flex border border-[#2D6A4F] rounded-md overflow-hidden text-xs">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLang(l.code)}
                className={`px-2 py-1 transition-colors ${lang === l.code ? 'bg-[#2D6A4F] text-white' : 'text-gray-300 hover:bg-[#2D6A4F]/50'}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarFallback className="bg-[#2D6A4F] text-white text-xs">
                    {user.displayName?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={onLoginClick}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white border border-[#2D6A4F]"
            >
              Login
            </Button>
          )}

          {/* Mobile hamburger — only show when logged in */}
          {user && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <button
                  className="lg:hidden text-white hover:bg-[#2D6A4F] p-2 rounded-md"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1B4332] text-white border-[#2D6A4F] w-64">
                <div className="flex flex-col gap-2 mt-8">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-2 rounded-md text-sm ${isActive(l.to) ? 'bg-[#2D6A4F]' : 'hover:bg-[#2D6A4F]/60'}`}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <div className="flex gap-1 mt-4 px-4">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLang(l.code)}
                        className={`px-3 py-1 rounded text-xs border border-[#2D6A4F] ${lang === l.code ? 'bg-[#2D6A4F]' : ''}`}
                      >
                        {l.label}
                      </button>
                    ))}
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
