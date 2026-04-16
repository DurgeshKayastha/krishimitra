import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { User, MapPin, Leaf, Bell, FileText, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SOIL_TYPES = ['Black/Regur', 'Red', 'Alluvial', 'Laterite', 'Sandy']
const STATES = ['Maharashtra', 'Karnataka', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat']
const CROPS = ['Wheat', 'Rice', 'Maize', 'Onion', 'Tomato', 'Soybean', 'Cotton', 'Sugarcane', 'Potato']
const COMMODITIES = ['Tomato', 'Onion', 'Potato', 'Wheat', 'Soybean', 'Cotton', 'Maize', 'Rice']

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [reports, setReports] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [newAlert, setNewAlert] = useState({ commodity: 'Tomato', price: '', district: '' })

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const fetchData = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid))
      if (snap.exists()) setProfile(snap.data())
      else setProfile({ displayName: user.displayName || '', state: 'Maharashtra', district: '', taluka: '', landSizeAcres: '', soilType: 'Black/Regur', primaryCrops: [], language: 'en', priceAlerts: [], bookmarkedSchemes: [] })

      const rSnap = await getDocs(query(collection(db, 'diseaseReports'), where('farmerUid', '==', user.uid)))
      setReports(rSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      setBookmarks(JSON.parse(localStorage.getItem('km_bookmarks') || '[]'))
      setLoading(false)
    }
    fetchData()
  }, [user])

  const saveProfile = async () => {
    if (!user || !profile) return
    setSaving(true)
    await setDoc(doc(db, 'users', user.uid), { ...profile, uid: user.uid, email: user.email || '' }, { merge: true })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setSaving(false)
  }

  const toggleCrop = (crop) => {
    setProfile(p => ({
      ...p,
      primaryCrops: p.primaryCrops?.includes(crop)
        ? p.primaryCrops.filter(c => c !== crop)
        : [...(p.primaryCrops || []), crop]
    }))
  }

  const addAlert = async () => {
    if (!newAlert.price || !newAlert.district) return
    const alert = { commodity: newAlert.commodity, price: Number(newAlert.price), district: newAlert.district }
    const updated = [...(profile.priceAlerts || []), alert]
    setProfile(p => ({ ...p, priceAlerts: updated }))
    await setDoc(doc(db, 'users', user.uid), { priceAlerts: updated }, { merge: true })
    setNewAlert({ commodity: 'Tomato', price: '', district: '' })
  }

  const removeAlert = async (i) => {
    const updated = profile.priceAlerts.filter((_, idx) => idx !== i)
    setProfile(p => ({ ...p, priceAlerts: updated }))
    await setDoc(doc(db, 'users', user.uid), { priceAlerts: updated }, { merge: true })
  }

  if (!user) return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-16 text-center">
      <div className="mt-16">
        <User className="w-16 h-16 mx-auto text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-[#1B4332] mb-2">Login to view your profile</h2>
        <p className="text-gray-500 text-sm">Sign in to save your farm details and track your reports</p>
      </div>
    </div>
  )

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 pt-20 pb-16">
      <div className="mt-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="mt-8 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B4332]">My Farm Profile</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email || user.phoneNumber}</p>
        </div>
        <Button variant="outline" onClick={logout} className="border-red-200 text-red-500 hover:bg-red-50 text-sm">
          Logout
        </Button>
      </div>

      <Tabs defaultValue="farm">
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="farm"><Leaf className="w-3.5 h-3.5 mr-1" />Farm</TabsTrigger>
          <TabsTrigger value="reports"><FileText className="w-3.5 h-3.5 mr-1" />Reports</TabsTrigger>
          <TabsTrigger value="alerts"><Bell className="w-3.5 h-3.5 mr-1" />Alerts</TabsTrigger>
          <TabsTrigger value="bookmarks"><Bookmark className="w-3.5 h-3.5 mr-1" />Saved</TabsTrigger>
        </TabsList>

        {/* Farm details */}
        <TabsContent value="farm">
          <Card className="rounded-xl shadow-sm border border-gray-100">
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Full Name</label>
                  <Input value={profile?.displayName || ''} onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))} placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Land Size (acres)</label>
                  <Input type="number" value={profile?.landSizeAcres || ''} onChange={e => setProfile(p => ({ ...p, landSizeAcres: e.target.value }))} placeholder="e.g. 2.5" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">State</label>
                  <select value={profile?.state || 'Maharashtra'} onChange={e => setProfile(p => ({ ...p, state: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">District</label>
                  <Input value={profile?.district || ''} onChange={e => setProfile(p => ({ ...p, district: e.target.value }))} placeholder="e.g. Ahmednagar" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Taluka</label>
                  <Input value={profile?.taluka || ''} onChange={e => setProfile(p => ({ ...p, taluka: e.target.value }))} placeholder="e.g. Kopargaon" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Soil Type</label>
                  <select value={profile?.soilType || 'Black/Regur'} onChange={e => setProfile(p => ({ ...p, soilType: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                    {SOIL_TYPES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium block mb-2">Primary Crops</label>
                <div className="flex flex-wrap gap-2">
                  {CROPS.map(c => (
                    <button key={c} onClick={() => toggleCrop(c)}
                      className={`px-3 py-1 rounded-lg text-xs border transition-colors ${profile?.primaryCrops?.includes(c) ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'border-gray-300 text-gray-600 hover:border-[#2D6A4F]'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={saveProfile} disabled={saving} className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white w-full">
                {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disease reports */}
        <TabsContent value="reports">
          <div className="flex flex-col gap-3">
            {reports.length === 0 ? (
              <Card className="rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-8 text-center text-gray-400 text-sm">
                  No disease reports submitted yet
                </CardContent>
              </Card>
            ) : reports.map(r => (
              <Card key={r.id} className="rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[#111827]">{r.diseaseName}</p>
                      <p className="text-sm text-gray-500">{r.cropType} · {r.district}</p>
                      <p className="text-xs text-gray-400 mt-1">{r.createdAt?.toDate?.()?.toLocaleDateString('en-IN') || ''}</p>
                    </div>
                    <Badge className={r.status === 'contained' ? 'bg-green-100 text-green-700' : r.status === 'reviewing' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}>
                      {r.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Price alerts */}
        <TabsContent value="alerts">
          <Card className="rounded-xl shadow-sm border border-gray-100 mb-4">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-[#1B4332] mb-3">Add Price Alert</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select value={newAlert.commodity} onChange={e => setNewAlert(a => ({ ...a, commodity: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                  {COMMODITIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <Input type="number" placeholder="Alert price (₹/quintal)" value={newAlert.price} onChange={e => setNewAlert(a => ({ ...a, price: e.target.value }))} />
                <Input placeholder="District" value={newAlert.district} onChange={e => setNewAlert(a => ({ ...a, district: e.target.value }))} />
              </div>
              <Button onClick={addAlert} disabled={!newAlert.price || !newAlert.district}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white mt-3 w-full">
                Add Alert
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            {(profile?.priceAlerts || []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No price alerts set</p>
            ) : profile.priceAlerts.map((a, i) => (
              <Card key={i} className="rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-[#111827]">{a.commodity}</p>
                    <p className="text-xs text-gray-500">Alert when price &gt; ₹{a.price}/quintal in {a.district}</p>
                  </div>
                  <button onClick={() => removeAlert(i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookmarked schemes */}
        <TabsContent value="bookmarks">
          <div className="flex flex-col gap-3">
            {bookmarks.length === 0 ? (
              <Card className="rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-8 text-center text-gray-400 text-sm">
                  No bookmarked schemes yet. <button onClick={() => navigate('/schemes')} className="text-[#2D6A4F] underline">Browse schemes</button>
                </CardContent>
              </Card>
            ) : bookmarks.map(id => {
              const scheme = [
                { id: 'pm-kisan', name: 'PM-KISAN', benefit: '₹6,000/year', applyLink: 'https://pmkisan.gov.in' },
                { id: 'fasal-bima', name: 'PM Fasal Bima Yojana', benefit: 'Crop insurance', applyLink: 'https://pmfby.gov.in' },
                { id: 'soil-health', name: 'Soil Health Card', benefit: 'Free soil testing', applyLink: 'https://soilhealth.dac.gov.in' },
                { id: 'kisan-credit', name: 'Kisan Credit Card', benefit: 'Credit at 4%', applyLink: 'https://www.nabard.org' },
                { id: 'enam', name: 'eNAM', benefit: 'Direct market access', applyLink: 'https://enam.gov.in' },
                { id: 'shetkari-sanman', name: 'Shetkari Sanman Yojana', benefit: 'Loan waiver', applyLink: 'https://mahadbt.maharashtra.gov.in' },
                { id: 'drip-irrigation', name: 'PM Krishi Sinchai Yojana', benefit: '55% subsidy', applyLink: 'https://pmksy.gov.in' },
                { id: 'agri-infra', name: 'Agriculture Infrastructure Fund', benefit: '3% interest subvention', applyLink: 'https://agriinfra.dac.gov.in' },
              ].find(s => s.id === id)
              if (!scheme) return null
              return (
                <Card key={id} className="rounded-xl shadow-sm border border-gray-100">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-[#111827]">{scheme.name}</p>
                      <p className="text-xs text-[#2D6A4F] font-medium">{scheme.benefit}</p>
                    </div>
                    <a href={scheme.applyLink} target="_blank" rel="noreferrer"
                      className="text-xs text-[#2D6A4F] hover:underline">Apply →</a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
