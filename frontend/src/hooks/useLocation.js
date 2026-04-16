import { useState, useEffect } from 'react'

export function useLocation() {
  const [location, setLocation] = useState({ lat: null, lon: null, error: null, loading: true })

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: null, lon: null, error: 'Geolocation not supported', loading: false })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, error: null, loading: false }),
      () => setLocation({ lat: 19.0748, lon: 74.7480, error: 'Location denied — using Kopargaon default', loading: false })
    )
  }, [])

  return location
}
