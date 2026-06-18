"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        window.alert("That backup file didn't unlock. Try another export.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <details className="group rounded-lg border">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-muted-foreground group-open:text-foreground">
          Backup your locks
        </span>
      </summary>
      <div className="flex flex-wrap gap-2 border-t px-4 py-3">
        <Button variant="outline" size="sm" onClick={() => downloadJson(state)}>
          <Download className="size-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="size-4" />
          Import
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
      </div>
    </details>
  );
}
