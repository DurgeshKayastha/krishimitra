import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
            <Leaf className="w-5 h-5 text-[#D8F3DC]" />
            KrishiMitra
          </div>
          <p className="text-sm">Smart farming starts here. AI-powered tools for Indian farmers.</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Quick Links</p>
          <div className="flex flex-col gap-1 text-sm">
            <Link to="/prices" className="hover:text-white">Crop Prices</Link>
            <Link to="/crop-advisor" className="hover:text-white">Crop Advisor</Link>
            <Link to="/disease-detect" className="hover:text-white">Disease Detect</Link>
            <Link to="/schemes" className="hover:text-white">Govt Schemes</Link>
          </div>
        </div>
        <div>
          <p className="text-white font-semibold mb-2">Resources</p>
          <div className="flex flex-col gap-1 text-sm">
            <a href="https://soilhealth.dac.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">Soil Health Card</a>
            <a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">eNAM Portal</a>
            <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-white">PM-KISAN</a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#2D6A4F] text-center py-4 text-xs text-gray-500">
        © 2026 KrishiMitra · Anjivani College of Engineering, Kopargaon
      </div>
    </footer>
  )
}
