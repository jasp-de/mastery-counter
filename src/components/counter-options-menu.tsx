"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CounterOptionsMenuProps {
  counterId: string;
  canDelete: boolean;
  onDelete: () => void;
  variant?: "list" | "detail";
  onEdit?: () => void;
  promptNoteOnQuickLog?: boolean;
  onTogglePromptNote?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function CounterOptionsMenu({
  counterId,
  canDelete,
  onDelete,
  variant = "list",
  onEdit,
  promptNoteOnQuickLog = false,
  onTogglePromptNote,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
}: CounterOptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground"
          aria-label="Counter options"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-base leading-none tracking-widest">···</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {variant === "list" && (
          <DropdownMenuItem asChild>
            <Link href={`/counter/${counterId}`}>Open</Link>
          </DropdownMenuItem>
        )}
        {variant === "list" ? (
          <DropdownMenuItem asChild>
            <Link href={`/counter/${counterId}?edit=1`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onEdit?.();
            }}
          >
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
        )}

        {onTogglePromptNote && (
          <DropdownMenuCheckboxItem
            checked={promptNoteOnQuickLog}
            onCheckedChange={() => onTogglePromptNote()}
            onSelect={(e) => e.preventDefault()}
          >
            Notes on quick lock-in
          </DropdownMenuCheckboxItem>
        )}

        {variant === "list" && (canMoveUp || canMoveDown) && (
          <>
            <DropdownMenuSeparator />
            {canMoveUp && onMoveUp && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onMoveUp();
                }}
              >
                <ArrowUp className="size-4" />
                Move up
              </DropdownMenuItem>
            )}
            {canMoveDown && onMoveDown && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onMoveDown();
                }}
              >
                <ArrowDown className="size-4" />
                Move down
              </DropdownMenuItem>
            )}
          </>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
