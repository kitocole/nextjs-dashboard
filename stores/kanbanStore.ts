// stores/kanbanStore.ts
import { create } from 'zustand';

type KanbanState = {
  selectedBoardId: string | null;
  setSelectedBoardId: (id: string) => void;
};

export const useKanbanStore = create<KanbanState>((set) => ({
  selectedBoardId: null,
  setSelectedBoardId: (id) => set({ selectedBoardId: id }),
}));
