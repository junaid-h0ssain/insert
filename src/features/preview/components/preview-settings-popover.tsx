"use client";

import { useState } from "react";
import { Settings2Icon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Id } from "../../../../convex/_generated/dataModel";
import { useUpdateProjectSettings } from "../../projects/hooks/use-projects";

interface ProjectSettings {
  installCommand?: string;
  devCommand?: string;
}

interface PreviewSettingsPopoverProps {
  projectId: Id<"projects">;
  initialValues?: ProjectSettings;
  onSave?: () => void;
}

export const PreviewSettingsPopover = ({
  projectId,
  initialValues,
  onSave,
}: PreviewSettingsPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [installCommand, setInstallCommand] = useState(
    initialValues?.installCommand ?? ""
  );
  const [devCommand, setDevCommand] = useState(
    initialValues?.devCommand ?? ""
  );

  const updateSettings = useUpdateProjectSettings();

  const handleSave = () => {
    updateSettings({
      id: projectId,
      settings: {
        installCommand: installCommand || undefined,
        devCommand: devCommand || undefined,
      },
    });
    setOpen(false);
    onSave?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          title="Preview settings"
        >
          <Settings2Icon className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">Preview Settings</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="install-command" className="text-xs">
              Install command
            </Label>
            <Input
              id="install-command"
              placeholder="npm install"
              value={installCommand}
              onChange={(e) => setInstallCommand(e.target.value)}
              className="h-7 text-xs font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dev-command" className="text-xs">
              Dev command
            </Label>
            <Input
              id="dev-command"
              placeholder="npm run dev"
              value={devCommand}
              onChange={(e) => setDevCommand(e.target.value)}
              className="h-7 text-xs font-mono"
            />
          </div>
          <Button size="sm" onClick={handleSave}>
            Save &amp; Restart
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
