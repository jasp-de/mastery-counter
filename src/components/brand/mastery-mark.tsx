import { cn } from "@/lib/utils";

interface MasteryMarkProps {
  className?: string;
}

export function MasteryMark({ className }: MasteryMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-6", className)}
    >
      <path
        d="M4 18L12 4l8 14H4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4M12 15h.01"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** @deprecated Use MasteryMark */
export const HourglassMark = MasteryMark;
