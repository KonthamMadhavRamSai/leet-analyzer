import type { ProblemStats } from "@/lib/leetcode-types";

const ROWS = [
  { label: "Easy", color: "var(--easy)", solvedKey: "easySolved", totalKey: "easyTotal" },
  { label: "Medium", color: "var(--medium)", solvedKey: "mediumSolved", totalKey: "mediumTotal" },
  { label: "Hard", color: "var(--hard)", solvedKey: "hardSolved", totalKey: "hardTotal" },
] as const;

export function DifficultyBreakdown({ stats }: { stats: ProblemStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {ROWS.map((row) => {
        const solved = stats[row.solvedKey];
        const total = stats[row.totalKey];
        const pct = solved !== null && total ? (solved / total) * 100 : null;

        return (
          <div key={row.label} className="panel p-5">
            <div className="flex items-baseline justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: row.color }}
              >
                {row.label}
              </span>
              <span className="num text-xs text-muted-foreground">
                {pct === null ? "N/A" : `${pct.toFixed(2)}%`}
              </span>
            </div>
            <p className="num mt-3 text-2xl font-semibold">
              {solved?.toLocaleString("en-US") ?? "N/A"}
              <span className="text-base text-muted-foreground">
                {" "}
                / {total?.toLocaleString("en-US") ?? "N/A"}
              </span>
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-panel-raised">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{ width: `${pct ?? 0}%`, backgroundColor: row.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
