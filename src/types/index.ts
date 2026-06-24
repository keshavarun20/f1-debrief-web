export interface TyrePrediction {
  tyre_life: number
  predicted_lap_time: number
}

export interface Stint {
  stint: number
  compound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET'
  deg_rate_per_lap: number
  base_pace_seconds: number
  predictions: TyrePrediction[]
}

export interface TyreDegResponse {
  driver: string
  stints: Stint[]
}

export interface SessionParams {
  year: number
  grand_prix: string
  session_type: string
  driver: string
}