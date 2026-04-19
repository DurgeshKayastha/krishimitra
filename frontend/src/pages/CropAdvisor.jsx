import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { postGroq } from '@/lib/api'
import { useLocation } from '@/hooks/useLocation'
import { useWeather } from '@/hooks/useWeather'
import { getCurrentSeason } from '@/lib/utils'
import { Sprout, MapPin, FlaskConical, CloudSun, ChevronRight, ChevronLeft } from 'lucide-react'

const STATES = ['Maharashtra', 'Karnataka', 'Punjab', 'Uttar Pradesh', 'Madhya Pradesh', 'Gujarat']
const MH_DISTRICTS = ['Ahmednagar', 'Akola', 'Aurangabad', 'Kolhapur', 'Latur', 'Nashik', 'Pune', 'Solapur', 'Nagpur', 'Kopargaon']
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
  const { lat, lon } = useLocation()
  const { data: weatherData } = useWeather(lat, lon)

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    state: 'Maharashtra',
    district: 'Ahmednagar',
    soilType: 'Black/Regur',
    pH: 6.5,
    nitrogen: 'Medium',
    phosphorus: 'Medium',
    potassium: 'Medium',
    season: getCurrentSeason(),
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const currentTemp = weatherData?.hourly?.temperature_2m?.[0] || 28
  const rainfall = weatherData?.daily?.precipitation_sum?.reduce((a, b) => a + b, 0)?.toFixed(1) || 'N/A'

  const fetchSuggestions = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await postGroq({
        systemPrompt: 'You are an expert agricultural advisor for Maharashtra, India. Always give practical, farmer-friendly advice.',
        messages: [{
          role: 'user',
          content: `Location: ${form.district}, ${form.state}. Soil: ${form.soilType}, pH ${form.pH}, N:${form.nitrogen} P:${form.phosphorus} K:${form.potassium}. Season: ${form.season}. Weather: Avg temp ${currentTemp}°C, Expected rainfall ${rainfall}mm. Suggest top 5 crops. For each crop give: crop name, why it suits this soil+climate, 3 best practices, expected yield per acre, current market outlook. Format clearly with crop names as headers.`,
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
              {lat && <p className="text-xs text-[#2D6A4F] bg-[#D8F3DC] px-3 py-1.5 rounded-lg">📍 GPS detected: {lat.toFixed(4)}, {lon.toFixed(4)}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">State</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-1">District</label>
                  <select value={form.district} onChange={e => set('district', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2D6A4F] focus:outline-none">
                    {MH_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Soil */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#1B4332]">Soil Information</h2>
              <div>
                <label className="text-sm text-gray-600 font-medium block mb-1">Soil Type</label>
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
                <h2 className="text-lg font-semibold text-[#1B4332]">AI Crop Recommendations</h2>
                <Badge className="bg-[#D8F3DC] text-[#2D6A4F] text-xs">Groq AI</Badge>
              </div>
              <div className="bg-[#f0fdf4] rounded-lg p-3 text-xs text-gray-500 flex flex-wrap gap-3">
                <span>📍 {form.district}, {form.state}</span>
                <span>🌱 {form.soilType} soil · pH {form.pH}</span>
                <span>🌾 {form.season} season</span>
              </div>
              {loading ? (
                <div className="space-y-3 mt-4">
                  {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none mt-2">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans"><span translate="no">{result}</span></pre>
                </div>
              )}
              <Button onClick={() => { setStep(0); setResult('') }} variant="outline"
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
