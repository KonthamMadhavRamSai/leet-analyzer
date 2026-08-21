import { ClientOnly } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ContestHistoryPoint } from "@/lib/leetcode-types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as ContestHistoryPoint;
  return (
    <div className="panel px-3 py-2 text-xs">
      <p className="font-medium">{point.contestName}</p>
      <p className="num mt-1 text-primary">Rating {point.rating.toLocaleString("en-US")}</p>
      {point.ranking !== null ? (
        <p className="num text-muted-foreground">Rank {point.ranking.toLocaleString("en-US")}</p>
      ) : null}
      <p className="text-muted-foreground">
        {new Date(point.date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export function ContestRatingChart({ history }: { history: ContestHistoryPoint[] }) {
  if (history.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No contest rating history available for this profile.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-lg bg-panel" />}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 12, right: 12, bottom: 4, left: -12 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 6" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              minTickGap={24}
            />
            <YAxis
              domain={["dataMin - 60", "dataMax + 60"]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)" }} />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 2.5, fill: "var(--primary)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ClientOnly>
    </div>
  );
}
