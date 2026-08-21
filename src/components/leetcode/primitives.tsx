import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("panel p-5 sm:p-6", className)}>{children}</section>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </h2>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: "easy" | "medium" | "hard" | "primary";
}) {
  const accentClass =
    accent === "easy"
      ? "text-easy"
      : accent === "medium"
        ? "text-medium"
        : accent === "hard"
          ? "text-hard"
          : accent === "primary"
            ? "text-primary"
            : "text-foreground";

  return (
    <div className="panel flex flex-col gap-1 p-5">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className={cn("num text-2xl font-semibold sm:text-3xl", accentClass)}>{value}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  );
}

export function formatNumber(n: number | null | undefined) {
  return typeof n === "number" ? n.toLocaleString("en-US") : "N/A";
}
