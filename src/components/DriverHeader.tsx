"use client";

import { DriverInfo } from "@/lib/api";
import { SessionParams } from "@/types";

interface DriverHeaderProps {
  driver: DriverInfo;
  session: SessionParams;
}

const SESSION_LABEL: Record<string, string> = {
  R: 'Race',
  Q: 'Qualifying',
  Q1: 'Qualifying — Q1',
  Q2: 'Qualifying — Q2',
  Q3: 'Qualifying — Q3',
  FP1: 'Practice 1',
  FP2: 'Practice 2',
  FP3: 'Practice 3',
  S: 'Sprint',
  SQ: 'Sprint Qualifying',
}

const COUNTRY_NAMES: Record<string, string> = {
  MON: "Monaco",
  GBR: "United Kingdom",
  NED: "Netherlands",
  ESP: "Spain",
  MEX: "Mexico",
  FIN: "Finland",
  AUS: "Australia",
  GER: "Germany",
  FRA: "France",
  CAN: "Canada",
  JPN: "Japan",
  THA: "Thailand",
  DEN: "Denmark",
  CHN: "China",
  USA: "United States",
  NZL: "New Zealand",
  BRA: "Brazil",
  ITA: "Italy",
  POL: "Poland",
  BEL: "Belgium",
  AUT: "Austria",
  SUI: "Switzerland",
  RUS: "Russia",
  ARG: "Argentina",
  POR: "Portugal",
  SWE: "Sweden",
  NOR: "Norway",
  IND: "India",
  IDN: "Indonesia",
  ZAF: "South Africa",
  MAL: "Malaysia",
  VEN: "Venezuela",
  COL: "Colombia",
  CZE: "Czech Republic",
  HUN: "Hungary",
};

const COUNTRY_TO_ISO2: Record<string, string> = {
  MON: "mc",
  GBR: "gb",
  NED: "nl",
  ESP: "es",
  MEX: "mx",
  FIN: "fi",
  AUS: "au",
  GER: "de",
  FRA: "fr",
  CAN: "ca",
  JPN: "jp",
  THA: "th",
  DEN: "dk",
  CHN: "cn",
  USA: "us",
  NZL: "nz",
  BRA: "br",
  ITA: "it",
  POL: "pl",
  BEL: "be",
  AUT: "at",
  SUI: "ch",
  RUS: "ru",
  ARG: "ar",
  POR: "pt",
  SWE: "se",
  NOR: "no",
  IND: "in",
  IDN: "id",
  ZAF: "za",
  MAL: "my",
  VEN: "ve",
  COL: "co",
  CZE: "cz",
  HUN: "hu",
};

export default function DriverHeader({ driver, session }: DriverHeaderProps) {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: "#161616",
        border: "1px solid #2A2A2A",
      }}
    >
      <div className="h-1 w-full" style={{ background: driver.team_colour }} />

      <div className="flex items-center gap-6 p-6">
        {/* Headshot */}
        <div className="relative flex-shrink-0">
          <div
            className="w-20 h-20 rounded-full overflow-hidden"
            style={{
              background: "#0D0D0D",
              border: `2px solid ${driver.team_colour}22`,
            }}
          >
            <img
              src={driver.headshot_url}
              alt={driver.full_name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: driver.team_colour,
              color: "#fff",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
            }}
          >
            {driver.number}
          </div>
        </div>

        {/* Name + team */}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{
              color: driver.team_colour,
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {driver.team}
          </p>
          <h2
            className="text-2xl font-semibold tracking-tight truncate"
            style={{ color: "#F2EFE8" }}
          >
            {driver.full_name}
          </h2>
          <p
            className="text-xs mt-1 flex items-center gap-2"
            style={{
              color: "#6B6B6B",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            <span
              className={`fi fi-${COUNTRY_TO_ISO2[driver.country_code] ?? "un"}`}
              style={{ borderRadius: 2, fontSize: 14 }}
            />
            {COUNTRY_NAMES[driver.country_code] ?? driver.country_code}
          </p>
        </div>

        {/* Session info */}
        <div className="text-right flex-shrink-0">
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{
              color: "#6B6B6B",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {SESSION_LABEL[session.session_type] ?? session.session_type}
          </p>
          <p
            className="text-lg font-semibold"
            style={{
              color: "#F2EFE8",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {session.grand_prix}
          </p>
          <p
            className="text-xs"
            style={{
              color: "#6B6B6B",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {session.year}
          </p>
        </div>
      </div>
    </div>
  );
}
