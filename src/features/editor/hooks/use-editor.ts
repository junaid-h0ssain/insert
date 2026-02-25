import { create } from "zustand";

import { Id } from "../../../../convex/_generated/dataModel";

interface Tab {
  fileId: Id<"files">;
  pinned: boolean;
}

interface EditorStore {
  // keyed by projectId
  projects: Record<
    string,
    {
      tabs: Tab[];
      activeTabId: Id<"files"> | null;
    }
  >;
  openFile: (
    projectId: Id<"projects">,
    fileId: Id<"files">,
    options: { pinned: boolean }
  ) => void;
  closeTab: (projectId: Id<"projects">, fileId: Id<"files">) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
  projects: {},

  openFile: (projectId, fileId, { pinned }) =>
    set((state) => {
      const project = state.projects[projectId] ?? { tabs: [], activeTabId: null };

      const existingIndex = project.tabs.findIndex((t) => t.fileId === fileId);

      let tabs: Tab[];
      if (existingIndex >= 0) {
        // Upgrade to pinned if needed
        tabs = project.tabs.map((t, i) =>
          i === existingIndex ? { ...t, pinned: t.pinned || pinned } : t
        );
      } else {
        // Replace an unpinned (preview) tab if one exists, otherwise append
        const previewIndex = project.tabs.findIndex((t) => !t.pinned);
        if (previewIndex >= 0) {
          tabs = project.tabs.map((t, i) =>
            i === previewIndex ? { fileId, pinned } : t
          );
        } else {
          tabs = [...project.tabs, { fileId, pinned }];
        }
      }

      return {
        projects: {
          ...state.projects,
          [projectId]: { tabs, activeTabId: fileId },
        },
      };
    }),

  closeTab: (projectId, fileId) =>
    set((state) => {
      const project = state.projects[projectId];
      if (!project) return state;

      const tabs = project.tabs.filter((t) => t.fileId !== fileId);
      let activeTabId = project.activeTabId;
      if (activeTabId === fileId) {
        activeTabId = tabs.length > 0 ? tabs[tabs.length - 1].fileId : null;
      }

      return {
        projects: {
          ...state.projects,
          [projectId]: { tabs, activeTabId },
        },
      };
    }),
}));

export const useEditor = (projectId: Id<"projects">) => {
  const store = useEditorStore();
  const project = store.projects[projectId] ?? { tabs: [], activeTabId: null };

  return {
    tabs: project.tabs,
    activeTabId: project.activeTabId,
    openFile: (fileId: Id<"files">, options: { pinned: boolean }) =>
      store.openFile(projectId, fileId, options),
    closeTab: (fileId: Id<"files">) => store.closeTab(projectId, fileId),
  };
};
