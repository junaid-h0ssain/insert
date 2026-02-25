"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";

interface PreviewTerminalProps {
  output: string;
  onCommand?: (command: string) => void;
}

export const PreviewTerminal = ({ output, onCommand }: PreviewTerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const lastLengthRef = useRef(0);
  const inputBufferRef = useRef("");

  // Initialize terminal
  useEffect(() => {
    if (!containerRef.current || terminalRef.current) return;

    const terminal = new Terminal({
      convertEol: true,
      disableStdin: !onCommand,
      fontSize: 12,
      fontFamily: "monospace",
      theme: { background: "#1f2228" },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    // Write existing output on mount
    if (output) {
      terminal.write(output);
      lastLengthRef.current = output.length;
    }

    requestAnimationFrame(() => fitAddon.fit());

    const inputDisposable = onCommand
      ? terminal.onData((data) => {
          if (data === "\r") {
            const command = inputBufferRef.current;
            terminal.write("\r\n");
            inputBufferRef.current = "";
            onCommand(command);
            return;
          }

          if (data === "\u007f") {
            if (inputBufferRef.current.length > 0) {
              inputBufferRef.current = inputBufferRef.current.slice(0, -1);
              terminal.write("\b \b");
            }
            return;
          }

          if (data >= " " && data !== "\u007f") {
            inputBufferRef.current += data;
            terminal.write(data);
          }
        })
      : null;

    const resizeObserver = new ResizeObserver(() => fitAddon.fit());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      inputDisposable?.dispose();
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
    // "output" does not need to be a dependency since it is not intended
    // to update anything, just used on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCommand]);

  // Write output
  useEffect(() => {
    if (!terminalRef.current) return;

    if (output.length < lastLengthRef.current) {
      terminalRef.current.clear();
      lastLengthRef.current = 0;
    }

    const newData = output.slice(lastLengthRef.current);
    if (newData) {
      terminalRef.current.write(newData);
      lastLengthRef.current = output.length;
    }
  }, [output]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 p-3 [&_.xterm]:h-full! [&_.xterm-viewport]:h-full! [&_.xterm-screen]:h-full! bg-sidebar"
    />
  );
};
