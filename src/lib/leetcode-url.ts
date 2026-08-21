/** Shared (browser + server safe) LeetCode profile URL parsing. */

export const USERNAME_PATTERN = /^[A-Za-z0-9_.-]{1,39}$/;

const ALLOWED_HOSTS = new Set(["leetcode.com", "www.leetcode.com", "leetcode.cn", "www.leetcode.cn"]);

export type ParseResult = { ok: true; username: string } | { ok: false; error: string };

/**
 * Accepts:
 *   https://leetcode.com/u/username/
 *   https://leetcode.com/u/username
 *   leetcode.com/u/username
 *   https://leetcode.com/username/   (legacy profile path)
 *   a bare username
 */
export function parseLeetCodeProfileUrl(raw: string): ParseResult {
  const input = raw.trim();
  if (!input) return { ok: false, error: "Please enter a LeetCode profile URL." };

  // Bare username shortcut
  if (!input.includes("/") && !input.includes(".") && !input.includes(" ")) {
    return USERNAME_PATTERN.test(input)
      ? { ok: true, username: input }
      : { ok: false, error: "That doesn't look like a valid LeetCode username." };
  }

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return { ok: false, error: "Invalid URL. Try https://leetcode.com/u/username/" };
  }

  if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) {
    return { ok: false, error: "Only leetcode.com profile URLs are supported." };
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return { ok: false, error: "No username found in that URL." };
  }

  const username = segments[0] === "u" || segments[0] === "profile" ? segments[1] : segments[0];
  if (!username) return { ok: false, error: "No username found in that URL." };
  if (!USERNAME_PATTERN.test(username)) {
    return { ok: false, error: "That doesn't look like a valid LeetCode username." };
  }
  return { ok: true, username };
}

export function profileUrlFor(username: string) {
  return `https://leetcode.com/u/${username}/`;
}
