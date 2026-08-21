import { ExternalLink, MapPin, Trophy, Hash } from "lucide-react";

import type { LeetCodeProfile, ContestStats } from "@/lib/leetcode-types";
import { formatNumber } from "./primitives";

export function ProfileHeader({
  profile,
  contest,
}: {
  profile: LeetCodeProfile;
  contest: ContestStats;
}) {
  return (
    <header className="panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={`${profile.username} avatar`}
            className="h-16 w-16 rounded-2xl border border-border object-cover sm:h-20 sm:w-20"
            loading="lazy"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-panel text-xl font-semibold sm:h-20 sm:w-20">
            {profile.username.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">{profile.username}</h1>
          <p className="text-sm text-muted-foreground">
            {profile.realName ?? "LeetCode profile"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Hash className="h-3.5 w-3.5" /> Rank {formatNumber(profile.ranking)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> Rating {formatNumber(contest.rating)}
            </span>
            {profile.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {profile.location}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <a
        href={profile.profileUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-panel px-4 py-2 text-sm font-medium transition-colors hover:bg-panel-raised"
      >
        Open LeetCode profile <ExternalLink className="h-4 w-4" />
      </a>
    </header>
  );
}
