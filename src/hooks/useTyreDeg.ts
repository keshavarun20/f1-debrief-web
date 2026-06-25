import { useQuery } from '@tanstack/react-query'
import { fetchTyreDeg } from '@/lib/api'
import { SessionParams } from '@/types'

export const useTyreDeg = (params: SessionParams | null) =>
  useQuery({
    queryKey: ['tyreDeg', params],
    queryFn: () => fetchTyreDeg(
      params!.year,
      params!.grand_prix,
      params!.session_type,
      params!.driver
    ),
    enabled: params !== null,
    staleTime: 1000 * 60 * 10,
    retry: false,
  })