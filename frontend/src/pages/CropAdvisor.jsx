import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { postGroq } from '@/lib/api'
import { useLocation } from '@/hooks/useLocation'
import { useWeather } from '@/hooks/useWeather'
import { getCurrentSeason } from '@/lib/utils'
import { Sprout, MapPin, FlaskConical, CloudSun, ChevronRight, ChevronLeft, Download } from 'lucide-react'
import jsPDF from 'jspdf'

const STATES = ['Maharashtra', 'Karnataka', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat']
const MH_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur',
  'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur',
  'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad',
  'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg',
  'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal', 'Kopargaon'
]

// Sample talukas/cities for major districts (can be expanded)
const TALUKAS = {
  'Ahmednagar': ['Ahmednagar', 'Akola', 'Jamkhed', 'Karjat', 'Kopargaon', 'Nagar', 'Nevasa', 'Parner', 'Pathardi', 'Rahata', 'Rahuri', 'Sangamner', 'Shevgaon', 'Shrigonda', 'Shrirampur'],
  'Pune': ['Pune City', 'Haveli', 'Mulshi', 'Maval', 'Bhor', 'Purandhar', 'Velhe', 'Baramati', 'Indapur', 'Daund', 'Shirur', 'Khed', 'Ambegaon', 'Junnar'],
  'Nashik': ['Nashik', 'Igatpuri', 'Dindori', 'Peth', 'Trimbakeshwar', 'Kalwan', 'Deola', 'Surgana', 'Baglan', 'Malegaon', 'Nandgaon', 'Chandwad', 'Niphad', 'Sinnar', 'Yeola'],
  'Nagpur': ['Nagpur Urban', 'Nagpur Rural', 'Kamptee', 'Hingna', 'Katol', 'Narkhed', 'Savner', 'Kalameshwar', 'Ramtek', 'Mouda', 'Parseoni', 'Umred', 'Kuhi', 'Bhiwapur'],
  'Solapur': ['Solapur North', 'Solapur South', 'Barshi', 'Akkalkot', 'Madha', 'Karmala', 'Pandharpur', 'Malshiras', 'Sangole', 'Mangalvedhe', 'Mohol'],
  'Kolhapur': ['Kolhapur', 'Panhala', 'Shahuwadi', 'Kagal', 'Hatkanangle', 'Shirol', 'Karvir', 'Bavda', 'Radhanagari', 'Gaganbawada', 'Bhudargad', 'Gadhinglaj', 'Chandgad', 'Ajra'],
  // Add 'Other' option for districts without detailed data
  'default': ['Select Taluka/City', 'Other (Type manually)']
}
const SOIL_TYPES = ['Black/Regur', 'Red', 'Alluvial', 'Laterite', 'Sandy']
const NPK_LEVELS = ['Low', 'Medium', 'High']
const SEASONS = ['Kharif', 'Rabi', 'Zaid']
const SEASON_COLORS = { Kharif: 'bg-green-100 text-green-700', Rabi: 'bg-blue-100 text-blue-700', Zaid: 'bg-orange-100 text-orange-700' }

const STEPS = [
  { label: 'Location', icon: MapPin },
  { label: 'Soil', icon: FlaskConical },
  { label: 'Season', icon: CloudSun },
  { label: 'Results', icon: Sprout },
]

export default function CropAdvisor() {
  const { lat, lon, loading: locationLoading } = useLocation()
  const { data: weatherData } = useWeather(lat, lon)

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    state: 'Maharashtra',
    district: 'Ahmednagar',
    taluka: '',
    village: '',
    soilType: 'Black/Regur',
    pH: 7.0,
    nitrogen: 'Medium',
    phosphorus: 'Medium',
    potassium: 'Medium',
    season: getCurrentSeason(),
  })
  const [result, setResult] = useState('')
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationDetected, setLocationDetected] = useState(false)
  const [manualOverride, setManualOverride] = useState(false)
  const [soilDataLoading, setSoilDataLoading] = useState(false)
  const [soilDataFetched, setSoilDataFetched] = useState(false)

  // Auto-detect district from GPS coordinates
  useEffect(() => {
    if (!lat || !lon || locationDetected || manualOverride) return
    
    const detectLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
        )
        const data = await response.json()
        
        console.log('🗺️ Nominatim API Response:', data)
        console.log('📍 Address object:', data.address)
        
        if (data.address) {
          // Try multiple address fields in priority order
          const possibleDistrict = 
            data.address.state_district || // Most reliable for districts
            data.address.county || 
            data.address.city || 
            data.address.town ||
            data.address.municipality ||
            data.address.village
          
          const state = data.address.state
          
          console.log('🔍 Raw district from API:', possibleDistrict)
          console.log('🔍 State from API:', state)
          
          // Improved matching - try multiple strategies
          if (possibleDistrict) {
            const districtLower = possibleDistrict.toLowerCase().trim()
            
            // Strategy 1: Exact match (case insensitive)
            let matchedDistrict = MH_DISTRICTS.find(d => 
              d.toLowerCase() === districtLower
            )
            console.log('Strategy 1 (exact match):', matchedDistrict || 'No match')
            
            // Strategy 2: Remove common suffixes first, then exact match
            if (!matchedDistrict) {
              const cleanedDistrict = districtLower
                .replace(/\s+district$/i, '')
                .replace(/\s+taluka$/i, '')
                .replace(/\s+tehsil$/i, '')
                .replace(/\s+taluk$/i, '')
                .trim()
              
              matchedDistrict = MH_DISTRICTS.find(d => 
                d.toLowerCase() === cleanedDistrict
              )
              console.log('Strategy 2 (cleaned exact):', cleanedDistrict, '→', matchedDistrict || 'No match')
            }
            
            // Strategy 3: Partial match (district name contains API result)
            if (!matchedDistrict) {
              matchedDistrict = MH_DISTRICTS.find(d => 
                d.toLowerCase().includes(districtLower)
              )
              console.log('Strategy 3 (district contains API):', matchedDistrict || 'No match')
            }
            
            // Strategy 4: Partial match (API result contains district name)
            if (!matchedDistrict) {
              matchedDistrict = MH_DISTRICTS.find(d => 
                districtLower.includes(d.toLowerCase())
              )
              console.log('Strategy 4 (API contains district):', matchedDistrict || 'No match')
            }
            
            if (matchedDistrict) {
              console.log('✅ Final matched district:', matchedDistrict)
              setForm(f => ({ ...f, district: matchedDistrict }))
              setLocationDetected(true)
            } else {
              console.log('❌ No match found for:', possibleDistrict)
              console.log('💡 Available districts:', MH_DISTRICTS.join(', '))
            }
          }
          
          // Update state if detected
          if (state && STATES.some(s => state.includes(s))) {
            const matchedState = STATES.find(s => state.includes(s))
            if (matchedState) {
              setForm(f => ({ ...f, state: matchedState }))
              console.log('✅ Matched state:', matchedState)
            }
          }
        }
      } catch (err) {
        console.log('❌ Location detection failed:', err)
      }
    }
    
    detectLocation()
  }, [lat, lon, locationDetected, manualOverride])

  // Auto-fetch soil data from SoilGrids API
  useEffect(() => {
    if (!lat || !lon || soilDataFetched) return
    
    const fetchSoilData = async () => {
      setSoilDataLoading(true)
      try {
        console.log('🌍 Fetching soil data for:', { lat, lon })
        
        // SoilGrids REST API - provides soil properties at any location
        const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o&property=nitrogen&property=soc&depth=0-5cm&value=mean`
        console.log('📡 SoilGrids API URL:', url)
        
        const response = await fetch(url)
        
        if (!response.ok) {
          console.error('❌ SoilGrids API error:', response.status, response.statusText)
          return
        }
        
        const data = await response.json()
        console.log('📦 SoilGrids API Response:', data)
        
        if (data.properties?.layers) {
          const layers = data.properties.layers
          console.log('🔬 Available layers:', layers.map(l => l.name))
          
          // Extract pH (phh2o)
          const phLayer = layers.find(l => l.name === 'phh2o')
          console.log('🧪 pH Layer:', phLayer)
          
          if (phLayer?.depths?.[0]?.values?.mean) {
            // SoilGrids returns pH * 10, so divide by 10
            const rawPH = phLayer.depths[0].values.mean
            const pH = (rawPH / 10).toFixed(1)
            console.log('✅ pH detected:', { raw: rawPH, calculated: pH })
            setForm(f => ({ ...f, pH: parseFloat(pH) }))
          } else {
            console.log('⚠️ No pH data in response')
          }
          
          // Extract Nitrogen (total nitrogen in g/kg)
          const nLayer = layers.find(l => l.name === 'nitrogen')
          console.log('🧪 Nitrogen Layer:', nLayer)
          
          if (nLayer?.depths?.[0]?.values?.mean) {
            const nValue = nLayer.depths[0].values.mean / 100 // Convert to g/kg
            // Classify as Low/Medium/High
            const nLevel = nValue < 1 ? 'Low' : nValue < 2 ? 'Medium' : 'High'
            console.log('✅ Nitrogen detected:', { raw: nLayer.depths[0].values.mean, calculated: nValue, level: nLevel })
            setForm(f => ({ ...f, nitrogen: nLevel }))
          } else {
            console.log('⚠️ No nitrogen data in response')
          }
          
          // Soil Organic Carbon can help estimate P and K
          const socLayer = layers.find(l => l.name === 'soc')
          console.log('🧪 SOC Layer:', socLayer)
          
          if (socLayer?.depths?.[0]?.values?.mean) {
            const socValue = socLayer.depths[0].values.mean / 10 // dg/kg
            // Higher organic carbon usually means better P and K
            const pLevel = socValue < 10 ? 'Low' : socValue < 20 ? 'Medium' : 'High'
            const kLevel = socValue < 10 ? 'Low' : socValue < 20 ? 'Medium' : 'High'
            console.log('✅ SOC detected:', { raw: socLayer.depths[0].values.mean, calculated: socValue, P: pLevel, K: kLevel })
            setForm(f => ({ ...f, phosphorus: pLevel, potassium: kLevel }))
          } else {
            console.log('⚠️ No SOC data in response')
          }
          
          setSoilDataFetched(true)
          console.log('✅ Soil data fetch completed')
        } else {
          console.log('⚠️ No layers found in API response')
        }
      } catch (err) {
        console.error('❌ Soil data fetch failed:', err)
      } finally {
        setSoilDataLoading(false)
      }
    }
    
    // Delay to avoid rate limiting
    const timer = setTimeout(fetchSoilData, 1000)
    return () => clearTimeout(timer)
  }, [lat, lon, soilDataFetched])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    // Reset taluka when district changes
    if (key === 'district') {
      setForm(f => ({ ...f, taluka: '', village: '' }))
    }
    // Reset village when taluka changes
    if (key === 'taluka') {
      setForm(f => ({ ...f, village: '' }))
    }
  }

  const availableTalukas = TALUKAS[form.district] || TALUKAS['default']

  const currentTemp = weatherData?.hourly?.temperature_2m?.[0] || 28
  const rainfall = weatherData?.daily?.precipitation_sum?.reduce((a, b) => a + b, 0)?.toFixed(1) || 'N/A'

  const fetchSuggestions = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await postGroq({
        systemPrompt: 'You are an expert agricultural advisor for Maharashtra, India. Provide concise, actionable recommendations.',
        messages: [{
          role: 'user',
          content: `Location: ${form.village ? `${form.village}, ` : ''}${form.taluka ? `${form.taluka}, ` : ''}${form.district}, ${form.state}. Soil: ${form.soilType}, pH ${form.pH}, N:${form.nitrogen} P:${form.phosphorus} K:${form.potassium}. Season: ${form.season}. Weather: Avg temp ${currentTemp}°C, Expected rainfall ${rainfall}mm.

Provide top 5 recommended crops. For each crop, format EXACTLY like this:

1. CROP_NAME
Suitability: Why this crop suits the conditions (1-2 lines)
Yield: Expected yield per acre
Price: Current market price range
Duration: Growing period in weeks/months

2. CROP_NAME
...

Keep each section brief and clear.`,
        }],
      })
      setResult(data.text)
      setStep(3)
    } catch {
      setError('Failed to get AI suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadCropPDF = async (cropName) => {
    setLoading(true)
    try {
      // Fetch detailed timeline for this specific crop
      const { data } = await postGroq({
        systemPrompt: 'You are an expert agricultural advisor. Provide detailed week-by-week farming guidance.',
        messages: [{
          role: 'user',
          content: `Crop: ${cropName}
Location: ${form.village ? `${form.village}, ` : ''}${form.taluka ? `${form.taluka}, ` : ''}${form.district}, ${form.state}
Soil: ${form.soilType}, pH ${form.pH}, N:${form.nitrogen} P:${form.phosphorus} K:${form.potassium}
Season: ${form.season}
Weather: ${currentTemp}°C, ${rainfall}mm rainfall expected

Provide DETAILED week-by-week timeline for growing ${cropName}:

WEEK 1:
- Tasks to do
- Precautions
- Weather contingency (if rain/drought/heat)

WEEK 2:
...

Continue for entire crop duration (typically 12-20 weeks depending on crop).

For each week include:
1. Main farming activities
2. Irrigation schedule
3. Fertilizer/pesticide application
4. Precautions and warnings
5. What to do if weather goes bad (heavy rain, drought, extreme heat)
6. Pest/disease watch

Be specific with quantities, timings, and actionable steps.`,
        }],
      })

      // Generate PDF
      const doc = new jsPDF()
      doc.setFont('helvetica')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const lineHeight = 6
      let y = 20

      // Header
      doc.setFontSize(20)
      doc.setTextColor(29, 106, 79)
      doc.text(`${cropName} - Planting Guide`, margin, y)
      y += 10

      // Location & Soil Info Box
      doc.setFillColor(240, 253, 244)
      doc.rect(margin, y, pageWidth - 2 * margin, 25, 'F')
      doc.setFontSize(9)
      doc.setTextColor(60, 60, 60)
      y += 6
      const locationText = `${form.village ? `${form.village}, ` : ''}${form.taluka ? `${form.taluka}, ` : ''}${form.district}, ${form.state}`
      doc.text(`📍 Location: ${locationText}`, margin + 3, y)
      y += 5
      doc.text(`🌱 Soil: ${form.soilType} | pH: ${form.pH} | NPK: ${form.nitrogen}/${form.phosphorus}/${form.potassium}`, margin + 3, y)
      y += 5
      doc.text(`🌾 Season: ${form.season} | 🌡️ Temp: ${currentTemp}°C | 🌧️ Rainfall: ${rainfall}mm`, margin + 3, y)
      y += 10

      // Divider
      doc.setDrawColor(45, 106, 79)
      doc.setLineWidth(0.5)
      doc.line(margin, y, pageWidth - margin, y)
      y += 8

      // Content
      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)
      const lines = data.text.split('\n')
      
      lines.forEach(line => {
        if (y > pageHeight - 20) {
          doc.addPage()
          y = 20
        }

        const trimmed = line.trim()
        
        // Week headers (WEEK 1, WEEK 2, etc.)
        if (/^WEEK\s+\d+/i.test(trimmed)) {
          if (y > 30) y += 4 // Add space before new week
          doc.setFillColor(45, 106, 79)
          doc.rect(margin, y - 4, pageWidth - 2 * margin, 8, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFont(undefined, 'bold')
          doc.setFontSize(11)
          doc.text(trimmed, margin + 3, y + 1)
          y += 10
          doc.setTextColor(0, 0, 0)
          doc.setFont(undefined, 'normal')
          doc.setFontSize(9)
        }
        // Sub-headers (bold text with **)
        else if (line.includes('**') || (trimmed.endsWith(':') && trimmed.length < 50)) {
          doc.setFont(undefined, 'bold')
          doc.setTextColor(29, 106, 79)
          const cleanLine = line.replace(/\*\*/g, '').trim()
          doc.text(cleanLine, margin + 2, y)
          y += lineHeight + 1
          doc.setFont(undefined, 'normal')
          doc.setTextColor(0, 0, 0)
        }
        // Bullet points
        else if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
          const cleanLine = trimmed.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '')
          const wrappedLines = doc.splitTextToSize(cleanLine, pageWidth - 2 * margin - 8)
          wrappedLines.forEach((wLine, idx) => {
            if (y > pageHeight - 20) {
              doc.addPage()
              y = 20
            }
            if (idx === 0) {
              doc.text('•', margin + 4, y)
            }
            doc.text(wLine, margin + 8, y)
            y += lineHeight
          })
        }
        // Regular text
        else if (trimmed.length > 0) {
          const wrappedLines = doc.splitTextToSize(trimmed, pageWidth - 2 * margin - 4)
          wrappedLines.forEach(wLine => {
            if (y > pageHeight - 20) {
              doc.addPage()
              y = 20
            }
            doc.text(wLine, margin + 2, y)
            y += lineHeight
          })
        } else {
          y += 3
        }
      })

      // Footer on all pages
      const totalPages = doc.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`KrishiMitra - Your Farming Companion | Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      }

      doc.save(`KrishiMitra_${cropName.replace(/\s+/g, '_')}_Timeline_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="mt-8 mb-6">
        <h1 className="text-2xl font-bold text-[#1B4332]">Crop Advisor</h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered crop recommendations for your farm</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              i === step ? 'bg-[#2D6A4F] text-white' : i < step ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'bg-gray-100 text-gray-400'
            }`}>
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
          </div>
        ))}
      </div>

      <Card className="rounded-xl shadow-sm border border-gray-100">
        <CardContent className="p-6">

          {/* Step 0 — Location */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#1B4332]">Your Location</h2>
              {lat && lon && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#2D6A4F] bg-[#D8F3DC] px-3 py-1.5 rounded-lg flex-1">
                      📍 GPS: {lat.toFixed(4)}, {lon.toFixed(4)}
                      {locationDetected && ` · Auto-detected: ${form.district}`}
                    </p>
                    {locationDetected && (
                      <button
                        onClick={() => { setLocationDetected(false); setManualOverride(true); }}
                        className="text-xs text-[#C62828] hover:underline ml-2"
                      >
                        Wrong? Change it
                      </button>
                    )}
                  </div>
                  {soilDataLoading && (
                    <p className="text-xs text-[#1565C0] bg-[#E3F2FD] px-3 py-1.5 rounded-lg">
                      🌍 Fetching soil data from SoilGrids...
                    </p>
                  )}
                  {soilDataFetched && (
                    <p className="text-xs text-[#2D6A4F] bg-[#D8F3DC] px-3 py-1.5 rounded-lg">
                      ✅ Soil data auto-filled from satellite data
                    </p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">
                    State {locationDetected && <span className="text-[#2D6A4F] text-xs">(auto-detected)</span>}
                  </label>
                  <select value={form.state} onChange={e => set('state', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">
                    District {locationDetected && <span className="text-[#2D6A4F] text-xs">(auto-detected)</span>}
                  </label>
                  <select value={form.district} onChange={e => { set('district', e.target.value); setManualOverride(true); }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                    {MH_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                  {locationDetected && (
                    <p className="text-xs text-gray-500 mt-1">⚠️ Verify this is correct for your location</p>
                  )}
                </div>
              </div>
              
              {/* Taluka/City and Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">
                    Taluka/City <span className="text-gray-400">(optional)</span>
                  </label>
                  {availableTalukas.includes('Other (Type manually)') && form.taluka === 'Other (Type manually)' ? (
                    <input
                      type="text"
                      value={form.taluka === 'Other (Type manually)' ? '' : form.taluka}
                      onChange={e => set('taluka', e.target.value)}
                      placeholder="Enter your taluka/city"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none"
                    />
                  ) : (
                    <select value={form.taluka} onChange={e => set('taluka', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                      <option value="">Select Taluka/City</option>
                      {availableTalukas.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">
                    Village <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.village}
                    onChange={e => set('village', e.target.value)}
                    placeholder="Enter your village name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Soil */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1B4332]">Soil Information</h2>
                {soilDataFetched && (
                  <Badge className="bg-[#D8F3DC] text-[#2D6A4F] text-xs">Auto-detected</Badge>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">
                  Soil Type {!soilDataFetched && <span className="text-gray-400">(Manual selection)</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {SOIL_TYPES.map(s => (
                    <button key={s} onClick={() => set('soilType', s)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.soilType === s ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]' : 'border-gray-300 text-gray-600 hover:border-[#2D6A4F]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">Soil pH: <span className="text-[#2D6A4F] font-bold">{form.pH}</span></label>
                <input type="range" min="4" max="9" step="0.1" value={form.pH}
                  onChange={e => set('pH', parseFloat(e.target.value))}
                  className="w-full accent-[#2D6A4F]" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>4.0 (Acidic)</span><span>9.0 (Alkaline)</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['nitrogen', 'Nitrogen (N)'], ['phosphorus', 'Phosphorus (P)'], ['potassium', 'Potassium (K)']].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-sm text-gray-600 font-medium block mb-1">{label}</label>
                    <select value={form[key]} onChange={e => set(key, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                      {NPK_LEVELS.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Season */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#1B4332]">Select Season</h2>
              <div className="grid grid-cols-3 gap-3">
                {SEASONS.map(s => (
                  <button key={s} onClick={() => set('season', s)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${form.season === s ? 'border-[#2D6A4F] bg-[#f0fdf4]' : 'border-gray-200 hover:border-[#2D6A4F]/50'}`}>
                    <div className="text-2xl mb-1">{s === 'Kharif' ? '🌧️' : s === 'Rabi' ? '❄️' : '☀️'}</div>
                    <Badge className={SEASON_COLORS[s]}>{s}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{s === 'Kharif' ? 'Jun–Oct' : s === 'Rabi' ? 'Nov–Mar' : 'Apr–Jun'}</p>
                  </button>
                ))}
              </div>
              <div className="bg-[#E3F2FD] rounded-lg p-3 text-sm text-[#1565C0]">
                🌡️ Current weather: {currentTemp}°C · Expected rainfall: {rainfall}mm (7-day)
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          )}

          {/* Step 3 — Results */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold text-[#1B4332]">Recommended Crops</h2>
                <Badge className="bg-[#D8F3DC] text-[#2D6A4F] text-xs">Top 5 Picks</Badge>
              </div>
              <div className="bg-[#f0fdf4] rounded-lg p-3 text-xs text-gray-500 flex flex-wrap gap-3">
                <span>📍 {form.village && `${form.village}, `}{form.taluka && `${form.taluka}, `}{form.district}, {form.state}</span>
                <span>🌱 {form.soilType} · pH {form.pH}</span>
                <span>🌾 {form.season}</span>
              </div>
              {loading ? (
                <div className="space-y-3 mt-4">
                  {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {result.split(/\n\n+/).map((section, idx) => {
                    const lines = section.split('\n').filter(l => l.trim())
                    if (lines.length === 0) return null
                    
                    // Find crop name - look for numbered line like "1. SUGARCANE" or just "SUGARCANE"
                    const firstLine = lines[0].trim()
                    const cropMatch = firstLine.match(/^\d+\.\s*(.+)$/) || firstLine.match(/^([A-Z][A-Za-z\s]+)$/)
                    
                    if (!cropMatch) return null
                    
                    const cropName = cropMatch[1].replace(/\*\*/g, '').trim()
                    const details = lines.slice(1).map(l => l.replace(/\*\*/g, '').trim()).filter(l => l && l.length > 0)
                    
                    if (details.length === 0) return null
                    
                    return (
                      <Card key={idx} className="border border-gray-200 hover:border-[#2D6A4F] transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center text-xl">
                                {idx === 0 ? '🌾' : idx === 1 ? '🌽' : idx === 2 ? '🥔' : idx === 3 ? '🍅' : '🥕'}
                              </div>
                              <h3 className="text-base font-bold text-[#1B4332]">{cropName}</h3>
                            </div>
                            <Button 
                              onClick={() => downloadCropPDF(cropName)} 
                              size="sm" 
                              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                              disabled={loading}
                            >
                              <Download className="w-3.5 h-3.5 mr-1" /> Timeline
                            </Button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-700">
                            {details.map((detail, i) => (
                              <p key={i} className="leading-relaxed">{detail}</p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }).filter(Boolean)}
                </div>
              )}
              <Button onClick={() => { setStep(0); setResult(''); setCrops([]) }} variant="outline"
                className="mt-4 border-[#2D6A4F] text-[#2D6A4F] w-full">
                Start Over
              </Button>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 3 && (
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}
                className="border-gray-300 text-gray-600">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              {step < 2 ? (
                <Button onClick={() => setStep(s => s + 1)} className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={fetchSuggestions} disabled={loading} className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white">
                  {loading ? 'Getting suggestions...' : 'Get AI Suggestions'}
                  <Sprout className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
