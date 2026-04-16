import { useQuery } from '@tanstack/react-query'
import { getPrices } from '@/lib/api'

export function usePrices(params) {
  return useQuery({
    queryKey: ['prices', params],
    queryFn: () => getPrices(params).then((r) => r.data),
    enabled: !!params?.state,
    staleTime: 1000 * 60 * 10,
  })
}
