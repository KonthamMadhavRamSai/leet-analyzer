# LeetCode Profile Analyzer

Paste a public LeetCode profile URL and get a dark analytics dashboard with solved-problem
breakdown, acceptance/submission statistics and full contest rating history — built from real
public LeetCode data only.

## Architecture

```
React (TanStack Start route + components)
        ↓  useServerFn / TanStack Query
Server function  src/lib/leetcode.functions.ts   (validation + in-memory TTL cache)
        ↓
LeetCode client  src/lib/leetcode.server.ts      (GraphQL request + response mapping)
        ↓
https://leetcode.com/graphql
```

> Note: this workspace runs on the fixed TanStack Start (React + TypeScript + Vite) stack, so the
> backend is implemented with type-safe server functions instead of Spring Boot, and caching uses a
> configurable in-process TTL cache instead of PostgreSQL. The layering (controller → service →
> client → mapper) is preserved: route → server function → client → mapper.

## Data source

A single GraphQL query (`profileAnalysis` in `src/lib/leetcode.server.ts`) fetches:

| Field | Source |
| --- | --- |
| Username, real name, avatar, country, ranking | `matchedUser.profile` |
| Solved per difficulty | `matchedUser.submitStats.acSubmissionNum` |
| Attempted questions / total submissions | `matchedUser.submitStats.totalSubmissionNum` |
| Problem totals per difficulty | `allQuestionsCount` |
| Contest rating / rank / attendance | `userContestRanking` |
| Contest history (chart) | `userContestRankingHistory` |

Derived metrics:

- `acceptanceRate = acceptedSubmissions / totalSubmissions * 100` (null when submissions are 0)
- `attempting = attemptedQuestions - solvedQuestions`
- `highestRating = max(rating)` over attended contests

No credentials, cookies or browser automation are used. Only `leetcode.com` is contacted.

## URL handling

`src/lib/leetcode-url.ts` accepts `https://leetcode.com/u/name/`, `.../u/name`, `leetcode.com/u/name`,
legacy `/name` paths and bare usernames. Other hosts, empty input and malformed usernames are
rejected before any network call (no SSRF surface).

## Data integrity

Missing metrics are returned as `null` and rendered as `N/A`; they are listed in the
`unavailable` array and surfaced in the dashboard notice. Nothing is estimated or hardcoded.

## Error handling

| Case | Message |
| --- | --- |
| Invalid URL / username | Inline validation error under the input |
| Unknown profile | "LeetCode profile not found." |
| HTTP 429 | "LeetCode is temporarily rate-limiting requests. Please try again shortly." |
| 5xx / malformed | "Unable to fetch LeetCode statistics right now. Please try again later." |

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `LEETCODE_CACHE_TTL_MINUTES` | `15` | Snapshot cache duration (server-side only) |

## Running

```bash
npm install
npm run dev     # http://localhost:8080
npm run build
```

## Limitations

- Contest data is only exposed for users who have attended rated contests; otherwise all contest
  cards show `N/A`.
- LeetCode exposes aggregate submission counters only, so acceptance rate is derived from those
  aggregates; per-submission history is not public.
- Cache is in-process, so it resets on redeploy.
