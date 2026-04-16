import { useQuery } from '@tanstack/react-query'
import { getWeather } from '@/lib/api'

export function useWeather(lat, lon) {
  return useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => getWeather(lat, lon).then((r) => r.data),
    enabled: !!lat && !!lon,
    staleTime: 1000 * 60 * 30,
  })
}
