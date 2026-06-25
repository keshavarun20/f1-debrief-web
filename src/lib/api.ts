import axios from "axios";
import { LapsResponse, TyreDegResponse } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
});

export const fetchTyreDeg = async (
  year: number,
  grand_prix: string,
  session_type: string,
  driver: string,
): Promise<TyreDegResponse> => {
  const { data } = await api.get(
    `/telemetry/tyreDegradation/${year}/${grand_prix}/${session_type}/${driver}`,
  );
  return data;
};

export const fetchLaps = async (
  year: number,
  grand_prix: string,
  session_type: string,
  driver: string,
): Promise<LapsResponse> => {
  const { data } = await api.get(
    `/telemetry/laps/${year}/${grand_prix}/${session_type}/${driver}`,
  );
  return data;
};


export interface DriverInfo {
  full_name: string
  team: string
  number: number
  headshot_url: string
  country_code: string
  team_colour: string
}

export const fetchDriverInfo = async (
  year: number,
  driver: string
): Promise<DriverInfo> => {
  const { data } = await api.get(`/drivers/${year}/${driver}`)
  return data
}