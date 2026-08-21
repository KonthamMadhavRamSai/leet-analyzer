import { profileUrlFor } from "./leetcode-url";
import type {
  ContestHistoryPoint,
  ContestStats,
  LeetCodeAnalysis,
  ProblemStats,
  SubmissionStats,
} from "./leetcode-types";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

export class LeetCodeError extends Error {
  constructor(
    message: string,
    public code: "NOT_FOUND" | "RATE_LIMITED" | "UPSTREAM" | "NETWORK",
  ) {
    super(message);
  }
}

const ANALYSIS_QUERY = /* GraphQL */ `
  query profileAnalysis($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
        countryName
        aboutMe
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      problemsSolved
      contest {
        title
        startTime
      }
    }
  }
`;

interface DifficultyEntry {
  difficulty: string;
  count: number;
  submissions?: number;
}

function pick(entries: DifficultyEntry[] | undefined, difficulty: string) {
  return entries?.find((e) => e.difficulty === difficulty);
}

export async function fetchLeetCodeAnalysis(username: string): Promise<LeetCodeAnalysis> {
  let res: Response;
  try {
    res = await fetch(LEETCODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: profileUrlFor(username),
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      },
      body: JSON.stringify({ query: ANALYSIS_QUERY, variables: { username } }),
    });
  } catch {
    throw new LeetCodeError(
      "Unable to reach LeetCode right now. Please try again later.",
      "NETWORK",
    );
  }

  if (res.status === 429) {
    throw new LeetCodeError(
      "LeetCode is temporarily rate-limiting requests. Please try again shortly.",
      "RATE_LIMITED",
    );
  }
  if (res.status === 404) {
    throw new LeetCodeError("LeetCode profile not found.", "NOT_FOUND");
  }
  if (!res.ok) {
    throw new LeetCodeError(
      "Unable to fetch LeetCode statistics right now. Please try again later.",
      "UPSTREAM",
    );
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new LeetCodeError("LeetCode returned a malformed response.", "UPSTREAM");
  }

  const data = json?.data;
  if (!data?.matchedUser) {
    throw new LeetCodeError("LeetCode profile not found.", "NOT_FOUND");
  }

  return mapAnalysis(username, data);
}

export function mapAnalysis(username: string, data: any): LeetCodeAnalysis {
  const user = data.matchedUser;
  const unavailable: string[] = [];

  const ac: DifficultyEntry[] | undefined = user?.submitStats?.acSubmissionNum;
  const total: DifficultyEntry[] | undefined = user?.submitStats?.totalSubmissionNum;
  const all: DifficultyEntry[] | undefined = data?.allQuestionsCount;

  const problemStats: ProblemStats = {
    totalSolved: pick(ac, "All")?.count ?? null,
    totalProblems: pick(all, "All")?.count ?? null,
    easySolved: pick(ac, "Easy")?.count ?? null,
    easyTotal: pick(all, "Easy")?.count ?? null,
    mediumSolved: pick(ac, "Medium")?.count ?? null,
    mediumTotal: pick(all, "Medium")?.count ?? null,
    hardSolved: pick(ac, "Hard")?.count ?? null,
    hardTotal: pick(all, "Hard")?.count ?? null,
  };
  if (problemStats.totalSolved === null) unavailable.push("Problem statistics");

  const acceptedSubs = pick(ac, "All")?.submissions ?? null;
  const totalSubs = pick(total, "All")?.submissions ?? null;
  const acceptanceRate =
    acceptedSubs !== null && totalSubs !== null && totalSubs > 0
      ? Math.round((acceptedSubs / totalSubs) * 10000) / 100
      : null;

  // "Attempting" = questions with submissions that were never accepted.
  const attemptedQuestions = pick(total, "All")?.count ?? null;
  const solvedQuestions = pick(ac, "All")?.count ?? null;
  const attempting =
    attemptedQuestions !== null && solvedQuestions !== null
      ? Math.max(0, attemptedQuestions - solvedQuestions)
      : null;

  const submissionStats: SubmissionStats = {
    acceptanceRate,
    totalSubmissions: totalSubs,
    acceptedSubmissions: acceptedSubs,
    attempting,
  };
  if (acceptanceRate === null) unavailable.push("Acceptance rate");

  const historyRaw: any[] = Array.isArray(data?.userContestRankingHistory)
    ? data.userContestRankingHistory
    : [];
  const contestHistory: ContestHistoryPoint[] = historyRaw
    .filter((h) => h?.attended && typeof h?.rating === "number")
    .map((h) => ({
      contestName: h?.contest?.title ?? "Contest",
      rating: Math.round(h.rating),
      date: new Date((h?.contest?.startTime ?? 0) * 1000).toISOString(),
      ranking: typeof h?.ranking === "number" ? h.ranking : null,
      problemsSolved: typeof h?.problemsSolved === "number" ? h.problemsSolved : null,
    }));

  const cr = data?.userContestRanking;
  const contestStats: ContestStats = {
    rating: typeof cr?.rating === "number" ? Math.round(cr.rating) : null,
    globalRank: typeof cr?.globalRanking === "number" ? cr.globalRanking : null,
    totalParticipants: typeof cr?.totalParticipants === "number" ? cr.totalParticipants : null,
    attended: typeof cr?.attendedContestsCount === "number" ? cr.attendedContestsCount : null,
    highestRating: contestHistory.length
      ? Math.max(...contestHistory.map((c) => c.rating))
      : null,
    topPercentage: typeof cr?.topPercentage === "number" ? cr.topPercentage : null,
  };
  if (contestStats.rating === null) unavailable.push("Contest statistics");

  return {
    profile: {
      username: user?.username ?? username,
      realName: user?.profile?.realName || null,
      avatar: user?.profile?.userAvatar || null,
      location: user?.profile?.countryName || null,
      about: user?.profile?.aboutMe || null,
      profileUrl: profileUrlFor(user?.username ?? username),
      ranking: typeof user?.profile?.ranking === "number" ? user.profile.ranking : null,
    },
    problemStats,
    submissionStats,
    contestStats,
    contestHistory,
    unavailable,
    fetchedAt: new Date().toISOString(),
    cached: false,
  };
}
