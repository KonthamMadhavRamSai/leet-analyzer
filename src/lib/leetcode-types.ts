export interface LeetCodeProfile {
  username: string;
  realName: string | null;
  avatar: string | null;
  location: string | null;
  about: string | null;
  profileUrl: string;
  ranking: number | null;
}

export interface ProblemStats {
  totalSolved: number | null;
  totalProblems: number | null;
  easySolved: number | null;
  easyTotal: number | null;
  mediumSolved: number | null;
  mediumTotal: number | null;
  hardSolved: number | null;
  hardTotal: number | null;
}

export interface SubmissionStats {
  acceptanceRate: number | null;
  totalSubmissions: number | null;
  acceptedSubmissions: number | null;
  attempting: number | null;
}

export interface ContestStats {
  rating: number | null;
  globalRank: number | null;
  totalParticipants: number | null;
  attended: number | null;
  highestRating: number | null;
  topPercentage: number | null;
}

export interface ContestHistoryPoint {
  contestName: string;
  rating: number;
  date: string;
  ranking: number | null;
  problemsSolved: number | null;
}

export interface LeetCodeAnalysis {
  profile: LeetCodeProfile;
  problemStats: ProblemStats;
  submissionStats: SubmissionStats;
  contestStats: ContestStats;
  contestHistory: ContestHistoryPoint[];
  unavailable: string[];
  fetchedAt: string;
  cached: boolean;
}
