"use client";

import { useEffect, useState } from "react";
import ky from "ky";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

import { Id } from "../../../../convex/_generated/dataModel";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProjectDialog = ({
  open,
  onOpenChange,
}: NewProjectDialogProps) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProject = useMutation(api.projects.create);

  const handleCreateBlank = async () => {
    setIsSubmitting(true);
    try {
      const projectName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
        separator: "-",
        length: 3,
      });
      const projectId = await createProject({ name: projectName });
      toast.success("Project created");
      onOpenChange(false);
      setInput("");
      router.push(`/projects/${projectId}`);
    } catch {
      toast.error("Unable to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text) return;

    setIsSubmitting(true);

    try {
      const { projectId } = await ky
        .post("/api/projects/create-with-prompt", {
          json: { prompt: message.text.trim() },
        })
        .json<{ projectId: Id<"projects"> }>();

      toast.success("Project created");
      onOpenChange(false);
      setInput("");
      router.push(`/projects/${projectId}`);
    } catch {
      toast.error("Unable to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="sm:max-w-lg p-0"
      >
        <DialogHeader className="hidden">
          <DialogTitle>What do you want to build?</DialogTitle>
          <DialogDescription>
            Describe your project and AI will help you create it.
          </DialogDescription>
        </DialogHeader>
        <PromptInput onSubmit={handleSubmit} className="border-none!">
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Ask Polaris to build..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
              disabled={isSubmitting}
            />
          </PromptInputBody>
          <PromptInputFooter>
             <PromptInputTools />
             <PromptInputSubmit disabled={!input || isSubmitting} />
          </PromptInputFooter>
        </PromptInput>
        <div className="px-4 pb-3 flex justify-center">
          <button
            onClick={handleCreateBlank}
            disabled={isSubmitting}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors disabled:opacity-50"
          >
            Create blank project
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
