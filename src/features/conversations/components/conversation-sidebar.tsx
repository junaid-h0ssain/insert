"use client";

import { MessageSquareIcon } from "lucide-react";

import { Id } from "../../../../convex/_generated/dataModel";

interface ConversationSidebarProps {
  projectId: Id<"projects">;
}

export const ConversationSidebar = ({ projectId: _projectId }: ConversationSidebarProps) => {
  return (
    <div className="h-full flex flex-col bg-sidebar border-r">
      <div className="h-8.75 flex items-center px-3 border-b">
        <span className="text-sm font-medium">Conversations</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <MessageSquareIcon className="size-6" />
        <p className="text-sm">No conversations yet</p>
      </div>
    </div>
  );
};
