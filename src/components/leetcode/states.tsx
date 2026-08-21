import { AlertTriangle } from "lucide-react";

export function LoadingSkeleton() {
  const bar = "animate-pulse rounded-lg bg-panel";
  return (
    <div className="space-y-6">
      <div className={`${bar} h-32`} />
      <div className={`${bar} h-80`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${bar} h-32`} />
        <div className={`${bar} h-32`} />
        <div className={`${bar} h-32`} />
      </div>
      <div className={`${bar} h-72`} />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="panel flex flex-col items-center gap-3 p-10 text-center">
      <AlertTriangle className="h-8 w-8 text-hard" />
      <p className="text-sm text-foreground">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="rounded-lg border border-border bg-panel px-4 py-2 text-sm font-medium transition-colors hover:bg-panel-raised"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
