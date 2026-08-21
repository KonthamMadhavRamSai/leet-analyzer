import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Code2 } from "lucide-react";
import { useState } from "react";

import { Dashboard } from "@/components/leetcode/Dashboard";
import { ProfileSearch } from "@/components/leetcode/ProfileSearch";
import { ErrorState, LoadingSkeleton } from "@/components/leetcode/states";
import { analyzeProfile } from "@/lib/leetcode.functions";

const TITLE = "LeetCode Profile Analyzer — Solved, Acceptance & Contest Stats";
const DESCRIPTION =
  "Paste any public LeetCode profile URL to see solved problems by difficulty, acceptance rate, submissions and full contest rating history in a dark analytics dashboard.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const [url, setUrl] = useState<string | null>(null);
  const analyze = useServerFn(analyzeProfile);

  const query = useQuery({
    queryKey: ["leetcode", url],
    enabled: url !== null,
    retry: false,
    staleTime: 5 * 60 * 1000,
    queryFn: () => analyze({ data: { url: url as string } }),
  });

  const hasSearched = url !== null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className={hasSearched ? "mb-8" : "mb-10 text-center"}>
        <div
          className={`inline-flex items-center gap-2 text-primary ${hasSearched ? "" : "justify-center"}`}
        >
          <Code2 className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em]">
            LeetCode Profile Analyzer
          </span>
        </div>

        {!hasSearched ? (
          <>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              Analyze any public
              <br />
              LeetCode profile
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Understand problem-solving progress and contest performance from real, public
              LeetCode data — no login, no cookies, no guessing.
            </p>
          </>
        ) : null}

        <div className={hasSearched ? "mt-4" : "mx-auto mt-8 max-w-2xl"}>
          <ProfileSearch
            initialValue={url ?? ""}
            loading={query.isFetching}
            compact={hasSearched}
            onSubmit={setUrl}
          />
        </div>
      </div>

      {query.isPending && hasSearched ? <LoadingSkeleton /> : null}

      {query.isError ? (
        <ErrorState
          message={(query.error as Error).message}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : null}

      {query.data ? <Dashboard data={query.data} /> : null}
    </main>
  );
}
