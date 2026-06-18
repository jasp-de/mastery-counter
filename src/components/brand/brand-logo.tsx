import Link from "next/link";
import { MasteryMark } from "@/components/brand/mastery-mark";
import { APP_EMOJI, APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  className?: string;
}

const sizeStyles = {
  sm: {
    box: "size-9 rounded-xl",
    icon: "size-5",
    title: "text-lg tracking-[0.2em]",
    tagline: "text-xs",
  },
  md: {
    box: "size-11 rounded-2xl",
    icon: "size-6",
    title: "text-2xl tracking-[0.18em]",
    tagline: "text-sm",
  },
  lg: {
    box: "size-14 rounded-2xl shadow-md",
    icon: "size-8",
    title: "text-4xl sm:text-5xl tracking-[0.15em]",
    tagline: "text-sm",
  },
};

export function BrandLogo({
  size = "md",
  showTagline = false,
  href,
  className,
}: BrandLogoProps) {
  const styles = sizeStyles[size];

  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center bg-primary text-primary-foreground",
          styles.box,
        )}
      >
        <MasteryMark className={styles.icon} />
      </div>
      <div className="min-w-0">
        <p className={cn("font-semibold leading-none uppercase", styles.title)}>
          {APP_EMOJI && (
            <span className="mr-1.5 normal-case tracking-normal" aria-hidden="true">
              {APP_EMOJI}
            </span>
          )}
          {APP_NAME}
        </p>
        {showTagline && (
          <p className={cn("mt-1.5 text-muted-foreground", styles.tagline)}>
            {APP_TAGLINE}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
