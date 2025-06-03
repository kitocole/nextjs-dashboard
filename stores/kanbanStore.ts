// stores/kanbanStore.ts
import { create } from 'zustand';

type KanbanState = {
  selectedBoardId: string | null;
  draggingCardId: string | null;
  setSelectedBoardId: (id: string) => void;
  setDraggingCardId: (id: string | null) => void;
};

export const useKanbanStore = create<KanbanState>((set) => ({
  selectedBoardId: null,
  draggingCardId: null,
  setSelectedBoardId: (id) => set({ selectedBoardId: id }),
  setDraggingCardId: (id) => set({ draggingCardId: id }),
}));
