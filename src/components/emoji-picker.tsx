"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_COUNTER_EMOJI,
  isSingleEmoji,
  normalizeEmoji,
  PICKER_EMOJIS,
} from "@/lib/emojis";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  id?: string;
}

export function EmojiPicker({ value, onChange, id }: EmojiPickerProps) {
  const selected = value || DEFAULT_COUNTER_EMOJI;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Icon</Label>
      <div className="flex flex-wrap gap-1.5">
        {PICKER_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            aria-label={`Select ${emoji}`}
            aria-pressed={selected === emoji}
            className={cn(
              "flex size-10 items-center justify-center rounded-lg border text-xl transition-colors hover:bg-accent",
              selected === emoji &&
                "border-primary bg-primary/10 ring-2 ring-primary ring-offset-1 ring-offset-background",
            )}
            onClick={() => onChange(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-sm text-muted-foreground">Or paste one:</span>
        <Input
          id={id}
          className="h-9 w-16 text-center text-xl"
          maxLength={4}
          placeholder="🎯"
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            if (!next) {
              onChange(DEFAULT_COUNTER_EMOJI);
              return;
            }
            if (isSingleEmoji(next)) onChange(next);
          }}
        />
      </div>
    </div>
  );
}

export { normalizeEmoji, DEFAULT_COUNTER_EMOJI };
