"use client";

import { CodeIcon } from "lucide-react";

import { Id } from "../../../../convex/_generated/dataModel";

interface EditorViewProps {
  projectId: Id<"projects">;
}

export const EditorView = ({ projectId: _projectId }: EditorViewProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-background">
      <CodeIcon className="size-6" />
      <p className="text-sm">No file open</p>
    </div>
  );
};
