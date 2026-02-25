"use client";

import { useEffect, useRef } from "react";

interface PreviewTerminalProps {
  output: string[];
}

export const PreviewTerminal = ({ output }: PreviewTerminalProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-foreground bg-background">
      {output.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-5">
          {line}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
