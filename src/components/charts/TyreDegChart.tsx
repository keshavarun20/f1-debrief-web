"use client";

import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Stint, Lap } from "@/types";
import { formatLapTime } from "@/lib/utils";

const COMPOUND_COLORS: Record<string, string> = {
  SOFT: "#E8380D",
  MEDIUM: "#F5C518",
  HARD: "#D4D0C8",
  INTERMEDIATE: "#4CAF50",
  WET: "#1E90FF",
};

interface TyreDegChartProps {
  stints: Stint[];
  laps: Lap[];
  driver: string;
}

const getMedian = (laps: Lap[]) => {
  const sorted = [...laps].map((l) => l.LapTime).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  const isActual = p?.type === "actual";

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2A2A2A",
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "var(--font-geist-mono)",
        fontSize: 12,
      }}
    >
      <p style={{ color: "#6B6B6B", marginBottom: 4 }}>Lap {p.lap}</p>
      {isActual ? (
        <>
          <p style={{ color: "#F2EFE8" }}>
            Actual{" "}
            <span style={{ fontWeight: 600 }}>{formatLapTime(p.actual)}</span>
          </p>
          <p style={{ color: "#6B6B6B", marginTop: 2 }}>
            {p.compound} · Tyre life {p.tyreLife}
          </p>
        </>
      ) : (
        <p style={{ color: "#F2EFE8" }}>
          Predicted{" "}
          <span style={{ fontWeight: 600 }}>{formatLapTime(p.predicted)}</span>
        </p>
      )}
    </div>
  );
};

export default function TyreDegChart({
  stints,
  laps,
  driver,
}: TyreDegChartProps) {
  const median = getMedian(laps);

  // actual laps — filter outlaps/pitstop laps
  const actualPoints = laps
    .filter((l) => l.LapTime <= median * 1.07)
    .map((l) => ({
      lap: l.LapNumber,
      actual: l.LapTime,
      compound: l.Compound,
      tyreLife: l.TyreLife,
      type: "actual",
    }));

  // predicted per stint — offset by cumulative lap count
  const predictedBySting = stints.map((stint, index) => {
    const lapOffset = stints
      .slice(0, index)
      .reduce((acc, s) => acc + s.predictions.length, 0);

    return {
      stint: stint.stint,
      compound: stint.compound,
      color: COMPOUND_COLORS[stint.compound] ?? "#D4D0C8",
      points: stint.predictions.map((p) => ({
        lap: lapOffset + p.tyre_life,
        predicted: p.predicted_lap_time,
        type: "predicted",
      })),
    };
  });

  // legend items
  const stintColors = predictedBySting.map((s) => ({
    label: `S${s.stint} · ${s.compound}`,
    color: s.color,
  }));

  return (
    <div
      className="w-full rounded-xl p-6"
      style={{ background: "#161616", border: "1px solid #2A2A2A" }}
    >
      <div className="mb-6">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{
            color: "#6B6B6B",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Tyre Degradation
        </p>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold" style={{ color: "#F2EFE8" }}>
            {driver.toUpperCase()} — Actual vs Predicted
          </h2>

          {/* Info tooltip */}
          <div className="relative group">
            <svg
              width="14"
              height="14"
              viewBox="0 0 12 12"
              fill="none"
              style={{ cursor: "help", flexShrink: 0, marginTop: 2 }}
            >
              <circle cx="6" cy="6" r="5.5" stroke="#6B6B6B" strokeWidth="1" />
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

            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 rounded-lg p-4 z-50
        opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150"
              style={{
                background: "#1E1E1E",
                border: "1px solid #2A2A2A",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#F2EFE8" }}
              >
                How predictions work
              </p>
              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "#6B6B6B" }}
              >
                Each predicted line is a linear regression model fitted to the
                actual lap times within that stint. It answers: if the driver
                continued on this tyre, how fast would each lap be?
              </p>

              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-[2px] flex-shrink-0"
                    style={{ background: "#E8380D" }}
                  />
                  <p className="text-xs" style={{ color: "#6B6B6B" }}>
                    Predicted — model regression line per stint
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      background: "#ffffff44",
                      border: "1px solid #888",
                    }}
                  />
                  <p className="text-xs" style={{ color: "#6B6B6B" }}>
                    Actual — real lap times (pit/SC laps filtered)
                  </p>
                </div>
              </div>

              <div className="pt-3" style={{ borderTop: "1px solid #2A2A2A" }}>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#6B6B6B" }}
                >
                  <span style={{ color: "#F2EFE8" }}>Slope</span> = degradation
                  rate (s/lap). A steeper line means faster tyre wear. A flat
                  line means the compound is holding pace well.
                </p>
              </div>

              <div
                className="pt-3 mt-3"
                style={{ borderTop: "1px solid #2A2A2A" }}
              >
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#6B6B6B" }}
                >
                  <span style={{ color: "#F2EFE8" }}>Outlaps and in-laps</span>{" "}
                  are excluded from both the model and the scatter — they skew
                  the regression significantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6 flex-wrap">
        {stintColors.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-5 h-[2px]" style={{ background: s.color }} />
            <span
              className="text-xs"
              style={{ color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}
            >
              {s.label}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <svg width="12" height="12">
            <circle
              cx="6"
              cy="6"
              r="4"
              fill="none"
              stroke="#888"
              strokeWidth="1.5"
            />
          </svg>
          <span
            className="text-xs"
            style={{ color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}
          >
            Actual
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart margin={{ top: 10, right: 20, left: 10, bottom: 24 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2A2A2A"
            vertical={false}
          />

          <XAxis
            type="number"
            dataKey="lap"
            allowDuplicatedCategory={false}
            domain={[1, "dataMax"]}
            tick={{
              fill: "#6B6B6B",
              fontSize: 11,
              fontFamily: "var(--font-geist-mono)",
            }}
            tickLine={false}
            axisLine={{ stroke: "#2A2A2A" }}
            label={{
              value: "Lap",
              position: "insideBottom",
              offset: -12,
              fill: "#6B6B6B",
              fontSize: 11,
              fontFamily: "var(--font-geist-mono)",
            }}
          />

          <YAxis
            tickFormatter={formatLapTime}
            tick={{
              fill: "#6B6B6B",
              fontSize: 11,
              fontFamily: "var(--font-geist-mono)",
            }}
            tickLine={false}
            axisLine={false}
            width={90}
            domain={["auto", "auto"]}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* One Line per stint */}
          {predictedBySting.map((s) => (
            <Line
              key={`predicted-${s.stint}`}
              data={s.points}
              type="monotone"
              dataKey="predicted"
              name={`S${s.stint}`}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: s.color }}
              isAnimationActive={false}
            />
          ))}

          {/* Actual scatter — compound coloured dots */}
          <Scatter
            data={actualPoints}
            dataKey="actual"
            name="actual"
            isAnimationActive={false}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const color = COMPOUND_COLORS[payload.compound] ?? "#888";
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={color}
                  fillOpacity={0.5}
                  stroke={color}
                  strokeWidth={1}
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
