"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GOAL_PRESETS, WEEKLY_GOAL_PRESETS } from "@/lib/constants";

interface CounterGoalFieldsProps {
  totalGoal: string;
  weeklyGoal: string;
  onTotalGoalChange: (value: string) => void;
  onWeeklyGoalChange: (value: string) => void;
  totalGoalId?: string;
  weeklyGoalId?: string;
}

export function CounterGoalFields({
  totalGoal,
  weeklyGoal,
  onTotalGoalChange,
  onWeeklyGoalChange,
  totalGoalId = "counter-goal",
  weeklyGoalId = "counter-weekly-goal",
}: CounterGoalFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={totalGoalId}>Total goal (hours)</Label>
        <p className="text-xs text-muted-foreground">
          How many hours until this lock-in feels real?
        </p>
        <div className="flex flex-wrap gap-1.5 pb-1">
          {GOAL_PRESETS.map((preset) => (
            <Button
              key={preset.hours}
              type="button"
              variant={totalGoal === String(preset.hours) ? "default" : "outline"}
              size="sm"
              onClick={() => onTotalGoalChange(String(preset.hours))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Input
          id={totalGoalId}
          type="number"
          min={1}
          value={totalGoal}
          onChange={(e) => onTotalGoalChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={weeklyGoalId}>Weekly goal (hours)</Label>
        <p className="text-xs text-muted-foreground">
          The rhythm that keeps you locked in — not the fantasy version.
        </p>
        <div className="flex flex-wrap gap-1.5 pb-1">
          {WEEKLY_GOAL_PRESETS.map((preset) => (
            <Button
              key={preset.hours}
              type="button"
              variant={
                weeklyGoal === String(preset.hours) ? "default" : "outline"
              }
              size="sm"
              onClick={() => onWeeklyGoalChange(String(preset.hours))}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Input
          id={weeklyGoalId}
          type="number"
          min={0.5}
          max={168}
          step={0.5}
          value={weeklyGoal}
          onChange={(e) => onWeeklyGoalChange(e.target.value)}
        />
      </div>
    </>
  );
}
