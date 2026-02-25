import { useState, useCallback } from "react";

import { Id } from "../../../../convex/_generated/dataModel";

type WebContainerStatus =
  | "idle"
  | "booting"
  | "installing"
  | "running"
  | "error";

interface ProjectSettings {
  installCommand?: string;
  devCommand?: string;
}

interface UseWebContainerOptions {
  projectId: Id<"projects">;
  enabled?: boolean;
  settings?: ProjectSettings;
}

interface UseWebContainerResult {
  status: WebContainerStatus;
  previewUrl: string | null;
  error: string | null;
  restart: () => void;
  terminalOutput: string[];
}

export const useWebContainer = ({
  projectId: _projectId,
  enabled: _enabled,
  settings: _settings,
}: UseWebContainerOptions): UseWebContainerResult => {
  const [status] = useState<WebContainerStatus>("idle");
  const [previewUrl] = useState<string | null>(null);
  const [error] = useState<string | null>(null);
  const [terminalOutput] = useState<string[]>([]);

  const restart = useCallback(() => {
    // no-op placeholder — real implementation would boot a WebContainer
  }, []);

  return { status, previewUrl, error, restart, terminalOutput };
};
