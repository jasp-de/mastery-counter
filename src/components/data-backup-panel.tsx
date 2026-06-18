"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCountersState } from "@/components/providers/counters-provider";
import { downloadJson, parseImport } from "@/lib/export-state";
import { mergeCountersStates } from "@/lib/merge-state";

export function DataBackupPanel() {
  const { state, setState } = useCountersState();
  const fileRef = useRef<HTMLInputElement>(null);

  function importFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImport(String(reader.result));
        setState((prev) => mergeCountersStates(prev, imported));
      } catch {
        window.alert("Could not read that backup file.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Backup & restore</CardTitle>
        <CardDescription>
          Export your counters as JSON or merge a backup file.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadJson(state)}
        >
          <Download className="size-4" />
          Export JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="size-4" />
          Import JSON
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importFile(file);
            e.target.value = "";
          }}
        />
      </CardContent>
    </Card>
  );
}
