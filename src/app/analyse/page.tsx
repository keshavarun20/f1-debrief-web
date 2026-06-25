"use client";

import { useState } from "react";
import SessionPicker from "@/components/SessionPicker";
import TyreDegChart from "@/components/charts/TyreDegChart";
import DriverHeader from "@/components/DriverHeader";
import { useTyreDeg } from "@/hooks/useTyreDeg";
import { useLaps } from "@/hooks/useLaps";
import { useDriverInfo } from "@/hooks/useDriverInfo";
import { SessionParams } from "@/types";
import { formatLapTime } from "@/lib/utils";
import SectorChart from "@/components/charts/SectorChart";

const COMPOUND_COLORS: Record<string, string> = {
  SOFT: "#E8380D",
  MEDIUM: "#F5C518",
  HARD: "#D4D0C8",
  INTERMEDIATE: "#4CAF50",
  WET: "#1E90FF",
};

export default function Analyse() {
  const [session, setSession] = useState<SessionParams | null>(null);

  const { data, isLoading, isError, error } = useTyreDeg(session);
  const { data: lapsData, isLoading: lapsLoading } = useLaps(session);
  const { data: driverData } = useDriverInfo(session);

  const loading = isLoading || lapsLoading;
  const ready = !!data && !!lapsData && !loading;

  return (
    <main className="min-h-screen px-4 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{
            color: "#E8380D",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          F1 Debrief
        </p>
        <h1
          className="text-4xl font-semibold tracking-tight mb-2"
          style={{ color: "#F2EFE8" }}
        >
          Post-Session Analysis
        </h1>
        <p
          className="text-sm"
          style={{ color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}
        >
          Tyre degradation · Pace delta · Race story
        </p>
      </div>

      {/* Session Picker */}
      <div className="mb-8">
        <SessionPicker onSubmit={setSession} loading={loading} />
      </div>

      {/* Loading */}
      {loading && session && (
        <div
          className="w-full rounded-xl p-12 flex items-center justify-center"
          style={{
            background: "#161616",
            border: "1px solid #2A2A2A",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: "#2A2A2A", borderTopColor: "#E8380D" }}
            />
            <p
              className="text-xs"
              style={{ color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}
            >
              Fetching telemetry...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && session && !loading && (
        <div
          className="w-full rounded-xl p-6"
          style={{
            background: "#161616",
            border: "1px solid #2A2A2A",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-1"
            style={{
              color: "#E8380D",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            Error
          </p>
          <p
            className="text-sm"
            style={{ color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}
          >
            {(error as Error)?.message ??
              "Failed to fetch. Check the API is running."}
          </p>
        </div>
      )}

      {/* Data */}
      {ready && (
        <div className="flex flex-col gap-6">
          {/* Driver header */}
          {driverData && session && (
            <DriverHeader driver={driverData} session={session} />
          )}

          {/* Stint summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {data.stints.map((stint) => (
              <div
                key={stint.stint}
                className="rounded-xl p-4"
                style={{
                  background: "#161616",
                  border: `1px solid ${
                    stint.compound === "SOFT"
                      ? "#E8380D33"
                      : stint.compound === "MEDIUM"
                        ? "#F5C51833"
                        : "#2A2A2A"
                  }`,
                }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-2"
                  style={{
                    color: "#6B6B6B",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Stint {stint.stint}
                </p>
                <p
                  className="text-lg font-semibold mb-2"
                  style={{
                    color: COMPOUND_COLORS[stint.compound] ?? "#D4D0C8",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  {stint.compound}
                </p>
                <p
                  className="text-xs mb-1"
                  style={{
                    color: "#6B6B6B",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Deg{" "}
                  <span style={{ color: "#F2EFE8" }}>
                    {stint.deg_rate_per_lap.toFixed(4)}s
                  </span>
                  /lap
                </p>
                <p
                  className="text-xs mb-1"
                  style={{
                    color: "#6B6B6B",
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  Base{" "}
                  <span style={{ color: "#F2EFE8" }}>
                    {formatLapTime(stint.base_pace_seconds)}
                  </span>
                </p>
                {stint.r_squared !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    <p
                      className="text-xs"
                      style={{
                        color: "#6B6B6B",
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    >
                      R²{" "}
                      <span
                        style={{
                          color:
                            stint.r_squared < 0.3
                              ? "#E8380D"
                              : stint.r_squared < 0.6
                                ? "#F5C518"
                                : "#4CAF50",
                        }}
                      >
                        {stint.r_squared.toFixed(2)}
                      </span>
                      {stint.r_squared < 0.3 && (
                        <span style={{ color: "#E8380D" }}> · unreliable</span>
                      )}
                      {stint.r_squared >= 0.3 && stint.r_squared < 0.6 && (
                        <span style={{ color: "#F5C518" }}> · noisy</span>
                      )}
                    </p>

                    {/* Info icon with tooltip */}
                    <div className="relative group">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        style={{ cursor: "help", flexShrink: 0 }}
                      >
                        <circle
                          cx="6"
                          cy="6"
                          r="5.5"
                          stroke="#6B6B6B"
                          strokeWidth="1"
                        />
                        <text
                          x="6"
                          y="9"
                          textAnchor="middle"
                          fontSize="8"
                          fill="#6B6B6B"
                          fontFamily="var(--font-geist-mono)"
                        >
                          i
                        </text>
                      </svg>

                      {/* Tooltip */}
                      <div
                        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-56 rounded-lg p-3 z-50
        opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150"
                        style={{
                          background: "#1E1E1E",
                          border: "1px solid #2A2A2A",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: "#F2EFE8" }}
                        >
                          R² — Model fit score
                        </p>
                        <p
                          className="text-xs leading-relaxed mb-2"
                          style={{ color: "#6B6B6B" }}
                        >
                          Measures how well the tyre degradation model fits the
                          actual lap data. 1.0 = perfect fit, 0.0 = no fit.
                        </p>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs" style={{ color: "#4CAF50" }}>
                            ≥ 0.6 · reliable prediction
                          </p>
                          <p className="text-xs" style={{ color: "#F5C518" }}>
                            0.3–0.6 · noisy stint data
                          </p>
                          <p className="text-xs" style={{ color: "#E8380D" }}>
                            {"< 0.3 · unreliable"}
                          </p>
                        </div>
                        <p
                          className="text-xs mt-2 leading-relaxed"
                          style={{ color: "#6B6B6B" }}
                        >
                          Low scores are common on short stints, managed laps,
                          or stints affected by safety cars.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tyre deg chart */}
          <TyreDegChart
            stints={data.stints}
            laps={lapsData.laps}
            driver={data.driver}
          />

          <SectorChart laps={lapsData.laps} driver={data.driver} />
        </div>
      )}
    </main>
  );
}
