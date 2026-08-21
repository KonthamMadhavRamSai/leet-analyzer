import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { parseLeetCodeProfileUrl } from "./leetcode-url";
import type { LeetCodeAnalysis } from "./leetcode-types";

const cache = new Map<string, { at: number; data: LeetCodeAnalysis }>();

export const analyzeProfile = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ url: z.string().min(1).max(300) }).parse(data))
  .handler(async ({ data }): Promise<LeetCodeAnalysis> => {
    const parsed = parseLeetCodeProfileUrl(data.url);
    if (!parsed.ok) throw new Error(parsed.error);

    const ttlMinutes = Number(process.env["LEETCODE_CACHE_TTL_MINUTES"] ?? 15);
    const key = parsed.username.toLowerCase();
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < ttlMinutes * 60_000) {
      return { ...hit.data, cached: true };
    }

    const { fetchLeetCodeAnalysis, LeetCodeError } = await import("./leetcode.server");
    try {
      const result = await fetchLeetCodeAnalysis(parsed.username);
      cache.set(key, { at: Date.now(), data: result });
      return result;
    } catch (err) {
      if (err instanceof LeetCodeError) throw new Error(err.message);
      throw new Error("Unable to fetch LeetCode statistics right now. Please try again later.");
    }
  });
