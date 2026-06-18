import { cn } from "@/lib/utils";

interface LockInMarkProps {
  className?: string;
}

export function LockInMark({ className }: LockInMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-6", className)}
    >
      <rect
        x="6"
        y="11"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.25" fill="currentColor" />
    </svg>
  );
}
