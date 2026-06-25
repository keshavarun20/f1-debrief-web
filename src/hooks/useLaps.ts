import { useQuery } from '@tanstack/react-query'
import { fetchLaps } from '@/lib/api'
import { SessionParams } from '@/types'

export const useLaps = (params: SessionParams | null) =>
  useQuery({
    queryKey: ['laps', params],
    queryFn: () => fetchLaps(
      params!.year,
      params!.grand_prix,
      params!.session_type,
      params!.driver
    ),
    enabled: params !== null,
    staleTime: 1000 * 60 * 10,
    retry: false,
  })