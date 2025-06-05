// hooks/useKanbanData.ts
import { BoardType } from '@/types/kanban';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Boards
import type { UseQueryResult } from '@tanstack/react-query';

export function useKanbanBoards(): UseQueryResult<BoardType[], Error> {
  return useQuery<BoardType[], Error>({
    queryKey: ['kanbanBoards'],
    queryFn: async () => {
      const res = await fetch('/api/kanban/boards');
      if (!res.ok) throw new Error('Failed to fetch boards');
      return res.json();
    },
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; ownerId: string }) => {
      const res = await fetch('/api/kanban/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create board');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoards'] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (boardId: string) => {
      const res = await fetch(`/api/kanban/boards/${boardId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete board');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoards'] });
    },
  });
}

// Columns
export function useCreateColumn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; order: number; boardId: string }) => {
      const res = await fetch('/api/kanban/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create column');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoards'] });
    },
  });
}

export function useUpdateColumn() {
  return useMutation({
    mutationFn: async ({
      columnId,
      ...data
    }: {
      columnId: string;
      title: string;
      order: number;
    }) => {
      const res = await fetch(`/api/kanban/columns/${columnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update column');
      return res.json();
    },
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (columnId: string) => {
      const res = await fetch(`/api/kanban/columns/${columnId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete column');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoards'] });
    },
  });
}

// Cards
export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string; order: number; columnId: string }) => {
      const res = await fetch('/api/kanban/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create card');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoards'] });
    },
  });
}

export function useUpdateCard() {
  return useMutation({
    mutationFn: async ({
      cardId,
      ...data
    }: {
      cardId: string;
      content: string;
      order: number;
      columnId: string;
    }) => {
      const res = await fetch(`/api/kanban/cards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update card');
      return res.json();
    },
    // No query invalidation
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cardId: string) => {
      const res = await fetch(`/api/kanban/cards/${cardId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete card');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanbanBoards'] });
    },
  });
}
