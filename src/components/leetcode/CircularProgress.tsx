interface Segment {
  value: number;
  color: string;
}

export function CircularProgress({
  solved,
  total,
  segments,
}: {
  solved: number | null;
  total: number | null;
  segments: Segment[];
}) {
  const size = 220;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 6;
  const denominator = total && total > 0 ? total : 1;

  let offsetAcc = 0;
  const arcs = segments.map((segment, index) => {
    const fraction = Math.min(1, Math.max(0, segment.value / denominator));
    const length = Math.max(0, fraction * circumference - gap);
    const arc = {
      key: index,
      color: segment.color,
      dasharray: `${length} ${circumference - length}`,
      dashoffset: -offsetAcc,
    };
    offsetAcc += fraction * circumference;
    return arc;
  });

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--panel-raised)"
          strokeWidth={stroke}
        />
        {arcs.map((arc) => (
          <circle
            key={arc.key}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={arc.dasharray}
            strokeDashoffset={arc.dashoffset}
            style={{ transition: "stroke-dasharray 700ms ease" }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-4xl font-semibold">
          {typeof solved === "number" ? solved.toLocaleString("en-US") : "N/A"}
        </span>
        <span className="num text-sm text-muted-foreground">
          /{typeof total === "number" ? total.toLocaleString("en-US") : "N/A"}
        </span>
        <span className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          Solved
        </span>
      </div>
    </div>
  );
}
