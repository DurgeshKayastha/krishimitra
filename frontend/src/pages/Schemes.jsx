import { useState } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Bookmark, BookmarkCheck, ExternalLink, Search } from 'lucide-react'

const SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    type: 'Central',
    description: 'Direct income support of ₹6,000 per year to small and marginal farmers in three equal installments.',
    eligibility: 'Small and marginal farmers with cultivable land up to 2 hectares',
    benefit: '₹6,000/year',
    applyLink: 'https://pmkisan.gov.in',
    category: 'income',
    crops: 'All crops',
  },
  {
    id: 'fasal-bima',
    name: 'PM Fasal Bima Yojana',
    fullName: 'Pradhan Mantri Fasal Bima Yojana',
    type: 'Central',
    description: 'Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities, pests and diseases.',
    eligibility: 'All farmers including sharecroppers and tenant farmers',
    benefit: 'Up to full sum insured',
    applyLink: 'https://pmfby.gov.in',
    category: 'insurance',
    crops: 'Kharif, Rabi, Commercial crops',
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    fullName: 'Soil Health Card Scheme',
    type: 'Central',
    description: 'Provides farmers a Soil Health Card with crop-wise recommendations of nutrients and fertilizers for individual farms.',
    eligibility: 'All farmers',
    benefit: 'Free soil testing and recommendations',
    applyLink: 'https://soilhealth.dac.gov.in',
    category: 'soil',
    crops: 'All crops',
  },
  {
    id: 'kisan-credit',
    name: 'Kisan Credit Card',
    fullName: 'Kisan Credit Card Scheme',
    type: 'Central',
    description: 'Provides farmers with affordable credit for agricultural needs including crop cultivation, post-harvest expenses and maintenance.',
    eligibility: 'All farmers, sharecroppers, oral lessees and self-help groups',
    benefit: 'Credit up to ₹3 lakh at 4% interest',
    applyLink: 'https://www.nabard.org/content1.aspx?id=572',
    category: 'credit',
    crops: 'All crops',
  },
  {
    id: 'enam',
    name: 'eNAM',
    fullName: 'National Agriculture Market',
    type: 'Central',
    description: 'Online trading platform for agricultural commodities connecting farmers directly to buyers across India.',
    eligibility: 'All farmers registered with local APMC',
    benefit: 'Better price discovery, direct market access',
    applyLink: 'https://enam.gov.in',
    category: 'market',
    crops: 'All crops',
  },
  {
    id: 'shetkari-sanman',
    name: 'Shetkari Sanman Yojana',
    fullName: 'Maharashtra Shetkari Sanman Yojana',
    type: 'State',
    description: 'Maharashtra state scheme providing loan waiver and financial assistance to distressed farmers.',
    eligibility: 'Maharashtra farmers with outstanding crop loans',
    benefit: 'Loan waiver up to ₹2 lakh',
    applyLink: 'https://mahadbt.maharashtra.gov.in',
    category: 'loan',
    crops: 'All crops',
  },
  {
    id: 'drip-irrigation',
    name: 'PM Krishi Sinchai Yojana',
    fullName: 'Pradhan Mantri Krishi Sinchai Yojana',
    type: 'Central',
    description: 'Provides subsidy on micro-irrigation systems like drip and sprinkler to improve water use efficiency.',
    eligibility: 'All farmers, priority to small and marginal farmers',
    benefit: '55% subsidy for small farmers, 45% for others',
    applyLink: 'https://pmksy.gov.in',
    category: 'irrigation',
    crops: 'All crops',
  },
  {
    id: 'agri-infra',
    name: 'Agriculture Infrastructure Fund',
    fullName: 'Agriculture Infrastructure Fund',
    type: 'Central',
    description: 'Financing facility for post-harvest management infrastructure and community farming assets.',
    eligibility: 'Farmers, FPOs, PACS, Agri-entrepreneurs',
    benefit: '3% interest subvention, credit guarantee',
    applyLink: 'https://agriinfra.dac.gov.in',
    category: 'infrastructure',
    crops: 'All crops',
  },
]

const TYPE_COLORS = { Central: 'bg-blue-100 text-blue-700', State: 'bg-green-100 text-green-700' }
const CATEGORY_LABELS = { all: 'All', income: 'Income Support', insurance: 'Insurance', credit: 'Credit', market: 'Market', soil: 'Soil', loan: 'Loan Waiver', irrigation: 'Irrigation', infrastructure: 'Infrastructure' }

export default function Schemes() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [bookmarks, setBookmarks] = useState(() => {
    return JSON.parse(localStorage.getItem('km_bookmarks') || '[]')
  })

  const toggleBookmark = async (schemeId) => {
    const isBookmarked = bookmarks.includes(schemeId)
    const updated = isBookmarked ? bookmarks.filter(b => b !== schemeId) : [...bookmarks, schemeId]
    setBookmarks(updated)
    localStorage.setItem('km_bookmarks', JSON.stringify(updated))

    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        bookmarkedSchemes: isBookmarked ? arrayRemove(schemeId) : arrayUnion(schemeId),
      }).catch(() => {})
    }
  }

  const filtered = SCHEMES.filter(s => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="mt-8 mb-6">
        <h1 className="text-2xl font-bold text-[#1B4332]">Government Schemes</h1>
        <p className="text-sm text-gray-500 mt-1">Central and State schemes for Indian farmers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search schemes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
          <option value="all">All Types</option>
          <option value="Central">Central Govt</option>
          <option value="State">State Govt</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 py-12 text-sm">No schemes found</div>
        ) : filtered.map(s => (
          <Card key={s.id} className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-[#111827]">{s.name}</h3>
                  <p className="text-xs text-gray-400">{s.fullName}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`text-xs ${TYPE_COLORS[s.type]}`}>{s.type}</Badge>
                  <button onClick={() => toggleBookmark(s.id)} className="text-gray-400 hover:text-[#2D6A4F] transition-colors">
                    {bookmarks.includes(s.id)
                      ? <BookmarkCheck className="w-4 h-4 text-[#2D6A4F]" />
                      : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.description}</p>

              <div className="space-y-1.5 mb-4">
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-400 w-20 shrink-0">Eligibility</span>
                  <span className="text-gray-600">{s.eligibility}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-400 w-20 shrink-0">Benefit</span>
                  <span className="font-semibold text-[#2D6A4F]">{s.benefit}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-400 w-20 shrink-0">Crops</span>
                  <span className="text-gray-600">{s.crops}</span>
                </div>
              </div>

              <a href={s.applyLink} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2D6A4F] hover:text-[#1B4332] transition-colors">
                Apply / Learn More <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
