import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { PricePoint } from "../types";
import { formatINR, formatINRFull } from "../lib/format";

export function PriceTrendChart({
  history,
  localityAvg,
  current,
}: {
  history: PricePoint[];
  localityAvg: number;
  current: number;
}) {
  const data = history.map((p) => ({ ...p, label: monthLabel(p.month) }));
  const lastPrice = history[history.length - 1]?.price ?? current;
  const diff = ((lastPrice - localityAvg) / localityAvg) * 100;
  const verdict: "overvalued" | "fair" | "deal" =
    diff > 6 ? "overvalued" : diff < -3 ? "deal" : "fair";
  const verdictMeta = {
    overvalued: { color: "#E53E3E", label: "Overvalued", bg: "bg-red-50" },
    fair: { color: "#38A169", label: "Fair Price", bg: "bg-green-50" },
    deal: { color: "#ED8936", label: "Great Deal", bg: "bg-orange-50" },
  }[verdict];

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-deep/10 text-brand-deep">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m7 14 4-4 4 4 5-5" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-deep">
              Price Trend
            </h3>
            <p className="text-xs text-brand-mute">6 months · vs locality avg</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${verdictMeta.bg}`}
          style={{ color: verdictMeta.color }}
        >
          {verdictMeta.label} ({diff > 0 ? "+" : ""}
          {diff.toFixed(0)}%)
        </span>
      </div>

      <div className="mt-4 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#718096" }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#718096" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatINR(v)}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                fontSize: 12,
              }}
              formatter={(v: number) => [formatINRFull(v), "Rent"]}
            />
            <ReferenceLine
              y={localityAvg}
              stroke="#ED8936"
              strokeDasharray="4 4"
              label={{
                value: `Avg ${formatINR(localityAvg)}`,
                position: "right",
                fontSize: 10,
                fill: "#ED8936",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1A365D"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#1A365D" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function monthLabel(m: string) {
  // m = "2026-07"
  const [y, mm] = m.split("-");
  const date = new Date(Number(y), Number(mm) - 1, 1);
  return date.toLocaleString("en", { month: "short" });
}
