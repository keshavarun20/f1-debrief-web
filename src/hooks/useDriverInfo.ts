import { useQuery } from '@tanstack/react-query'
import { fetchDriverInfo } from '@/lib/api'
import { SessionParams } from '@/types'

export const useDriverInfo = (params: SessionParams | null) =>
  useQuery({
    queryKey: ['driverInfo', params?.year, params?.driver],
    queryFn: () => fetchDriverInfo(params!.year, params!.driver),
    enabled: params !== null,
    staleTime: 1000 * 60 * 60,
    retry: false,
  })