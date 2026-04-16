import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useLocation } from '@/hooks/useLocation'
import { useWeather } from '@/hooks/useWeather'
import { postGroq } from '@/lib/api'
import { CloudSun, Droplets, Wind, Thermometer, AlertTriangle, CalendarDays } from 'lucide-react'

const WMO_CODES = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  51: { label: 'Drizzle', icon: '🌦️' },
  61: { label: 'Rain', icon: '🌧️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '⛈️' },
  80: { label: 'Showers', icon: '🌦️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
}

const getWeatherInfo = (code) => WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Weather() {
  const { lat, lon, loading: locLoading } = useLocation()
  const { data, isLoading, isError } = useWeather(lat, lon)
  const [calendar, setCalendar] = useState('')
  const [calLoading, setCalLoading] = useState(false)

  useEffect(() => {
    if (!data?.daily) return
    const fetchCalendar = async () => {
      setCalLoading(true)
      try {
        const summary = data.daily.time.map((date, i) => {
          const info = getWeatherInfo(data.daily.weathercode[i])
          return `${date}: ${info.label}, max ${data.daily.temperature_2m_max[i]}°C, rain ${data.daily.precipitation_sum[i]}mm`
        }).join('; ')
        const { data: res } = await postGroq({
          messages: [{ role: 'user', content: `Given this 7-day weather forecast for a farmer in Maharashtra: ${summary}. Generate a day-by-day farming activity calendar with 1-2 practical suggestions per day. Keep each day's suggestion to one short sentence.` }],
        })
        setCalendar(res.text)
      } catch {
        setCalendar('')
      } finally {
        setCalLoading(false)
      }
    }
    fetchCalendar()
  }, [data])

  const daily = data?.daily
  const hourly = data?.hourly

  // current conditions from first hourly entry
  const currentTemp = hourly?.temperature_2m?.[0]
  const currentHumidity = hourly?.relative_humidity_2m?.[0]
  const currentWind = hourly?.windspeed_10m?.[0]
  const currentUV = hourly?.uv_index?.[0]

  // rainfall chart data
  const rainfallData = daily?.time?.map((date, i) => ({
    day: DAYS[new Date(date).getDay()],
    rain: daily.precipitation_sum[i],
  })) || []

  const hasHeavyRain = daily?.precipitation_sum?.some(r => r > 30)

  if (locLoading || isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="mt-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  )

  if (isError) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="mt-8 text-center text-gray-400">Failed to load weather data.</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="mt-8 mb-6">
        <h1 className="text-2xl font-bold text-[#1B4332]">Weather & Farm Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">Hyperlocal forecast for your location · Open-Meteo</p>
      </div>

      {/* Heavy rain alert */}
      {hasHeavyRain && (
        <div className="bg-[#FFEBEE] border border-[#C62828] text-[#C62828] rounded-xl px-4 py-3 flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Heavy rainfall (&gt;30mm) expected in the next 7 days. Avoid spraying pesticides and plan irrigation accordingly.</span>
        </div>
      )}

      {/* Current conditions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Thermometer, label: 'Temperature', value: `${currentTemp}°C`, color: 'text-[#E76F00]', bg: 'bg-[#FFF3E0]' },
          { icon: Droplets, label: 'Humidity', value: `${currentHumidity}%`, color: 'text-[#1565C0]', bg: 'bg-[#E3F2FD]' },
          { icon: Wind, label: 'Wind Speed', value: `${currentWind} km/h`, color: 'text-[#2D6A4F]', bg: 'bg-[#D8F3DC]' },
          { icon: CloudSun, label: 'UV Index', value: currentUV, color: 'text-[#C62828]', bg: 'bg-[#FFEBEE]' },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl shadow-sm border border-gray-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-lg font-bold text-[#111827]">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 7-day forecast strip */}
      <Card className="rounded-xl shadow-sm border border-gray-100 mb-6">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-[#1B4332] mb-4">7-Day Forecast</p>
          <div className="grid grid-cols-7 gap-2">
            {daily?.time?.map((date, i) => {
              const info = getWeatherInfo(daily.weathercode[i])
              return (
                <div key={date} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-xs text-gray-500">{DAYS[new Date(date).getDay()]}</span>
                  <span className="text-2xl">{info.icon}</span>
                  <span className="text-xs font-semibold text-[#111827]">{daily.temperature_2m_max[i]}°</span>
                  <span className="text-xs text-gray-400">{daily.temperature_2m_min[i]}°</span>
                  <span className="text-xs text-[#1565C0]">{daily.precipitation_sum[i]}mm</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall chart */}
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-[#1B4332] mb-3">Rainfall Forecast (mm)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={rainfallData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}mm`, 'Rainfall']} />
                <Bar dataKey="rain" fill="#1565C0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Groq farming calendar */}
        <Card className="rounded-xl shadow-sm border border-gray-100 bg-[#f0fdf4]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-[#2D6A4F]" />
              <p className="text-sm font-semibold text-[#1B4332]">AI Farming Calendar</p>
              <Badge className="bg-[#D8F3DC] text-[#2D6A4F] text-xs">Groq AI</Badge>
            </div>
            {calLoading ? (
              <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
              </div>
            ) : calendar ? (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{calendar}</p>
            ) : (
              <p className="text-sm text-gray-400">Calendar will appear after weather loads.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
