"use client";

import type { LucideIcon } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type OptionsMenuItem =
  | {
      kind: "link";
      label: string;
      href: string;
      icon?: LucideIcon;
    }
  | {
      kind: "action";
      label: string;
      onSelect: () => void;
      icon?: LucideIcon;
      destructive?: boolean;
    }
  | { kind: "separator" };

interface RowOptionsMenuProps {
  items: OptionsMenuItem[];
  ariaLabel?: string;
  className?: string;
}

export function RowOptionsMenu({
  items,
  ariaLabel = "Options",
  className,
}: RowOptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className ?? "size-8 shrink-0 text-muted-foreground"}
          aria-label={ariaLabel}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {items.map((item, index) => {
          if (item.kind === "separator") {
            return <DropdownMenuSeparator key={`sep-${index}`} />;
          }

          const Icon = item.icon;

          if (item.kind === "link") {
            return (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href}>
                  {Icon && <Icon className="size-4" />}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={item.label}
              variant={item.destructive ? "destructive" : "default"}
              onSelect={(e) => {
                e.preventDefault();
                item.onSelect();
              }}
            >
              {Icon && <Icon className="size-4" />}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
