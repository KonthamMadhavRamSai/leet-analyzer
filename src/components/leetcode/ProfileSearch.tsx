import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { parseLeetCodeProfileUrl } from "@/lib/leetcode-url";

export function ProfileSearch({
  initialValue = "",
  loading,
  onSubmit,
  compact,
}: {
  initialValue?: string;
  loading: boolean;
  onSubmit: (url: string) => void;
  compact?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = parseLeetCodeProfileUrl(value);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://leetcode.com/u/username/"
            aria-label="LeetCode profile URL"
            className="h-12 w-full rounded-xl border border-border bg-input pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Analyze profile"}
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-hard">{error}</p> : null}
      {!compact && !error ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Example: https://leetcode.com/u/neetcode/
        </p>
      ) : null}
    </form>
  );
}
