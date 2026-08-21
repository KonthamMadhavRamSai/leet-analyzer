import { Info } from "lucide-react";

import type { LeetCodeAnalysis } from "@/lib/leetcode-types";
import { CircularProgress } from "./CircularProgress";
import { ContestRatingChart } from "./ContestRatingChart";
import { DifficultyBreakdown } from "./DifficultyBreakdown";
import { ProfileHeader } from "./ProfileHeader";
import { Panel, SectionLabel, StatCard, formatNumber } from "./primitives";

export function Dashboard({ data }: { data: LeetCodeAnalysis }) {
  const { problemStats: p, submissionStats: s, contestStats: c } = data;

  return (
    <div className="space-y-6">
      <ProfileHeader profile={data.profile} contest={c} />

      {data.unavailable.length > 0 ? (
        <div className="flex items-start gap-2 rounded-lg border border-border bg-panel px-4 py-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Some metrics are not publicly exposed for this profile and are shown as N/A:{" "}
            {data.unavailable.join(", ")}.
          </span>
        </div>
      ) : null}

      <Panel>
        <SectionLabel>Problem solving</SectionLabel>
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <CircularProgress
            solved={p.totalSolved}
            total={p.totalProblems}
            segments={[
              { value: p.easySolved ?? 0, color: "var(--easy)" },
              { value: p.mediumSolved ?? 0, color: "var(--medium)" },
              { value: p.hardSolved ?? 0, color: "var(--hard)" },
            ]}
          />
          <DifficultyBreakdown stats={p} />
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Acceptance"
          value={s.acceptanceRate === null ? "N/A" : `${s.acceptanceRate.toFixed(2)}%`}
          hint={
            s.acceptanceRate === null
              ? "Not exposed publicly for this profile"
              : `${formatNumber(s.acceptedSubmissions)} accepted submissions`
          }
          accent="primary"
        />
        <StatCard
          label="Submissions"
          value={formatNumber(s.totalSubmissions)}
          hint="All-time submissions"
        />
        <StatCard
          label="Attempting"
          value={formatNumber(s.attempting)}
          hint="Attempted but not yet solved"
        />
      </div>

      <Panel>
        <SectionLabel>Contest performance</SectionLabel>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Contest rating" value={formatNumber(c.rating)} accent="primary" />
          <StatCard
            label="Global ranking"
            value={formatNumber(c.globalRank)}
            hint={c.totalParticipants ? `of ${formatNumber(c.totalParticipants)}` : undefined}
          />
          <StatCard label="Contests attended" value={formatNumber(c.attended)} />
          <StatCard label="Highest rating" value={formatNumber(c.highestRating)} accent="easy" />
        </div>
        <div className="mt-6">
          <SectionLabel>Rating history</SectionLabel>
          <div className="mt-3">
            <ContestRatingChart history={data.contestHistory} />
          </div>
        </div>
      </Panel>

      <p className="text-center text-xs text-muted-foreground">
        Data fetched from LeetCode&apos;s public GraphQL API at{" "}
        {new Date(data.fetchedAt).toLocaleString()}
        {data.cached ? " (cached)" : ""}.
      </p>
    </div>
  );
}
