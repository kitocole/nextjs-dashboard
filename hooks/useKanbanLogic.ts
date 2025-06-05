'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  useKanbanBoards,
  useCreateBoard,
  useDeleteBoard,
  useCreateColumn,
  useUpdateColumn,
  useCreateCard,
  useUpdateCard,
  useDeleteColumn,
  useDeleteCard,
} from './useKanbanData';
import type { BoardType, ColumnType, CardType } from '@/types/kanban';
import { arrayMove } from '@dnd-kit/sortable';

export function useKanbanLogic() {
  const { data: session } = useSession();
  const ownerId = session?.user?.id;

  const { data: boards, isLoading } = useKanbanBoards();
  const createBoard = useCreateBoard();
  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const deleteColumn = useDeleteColumn();
  const deleteBoard = useDeleteBoard();

  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  const board: BoardType | null = useMemo(() => {
    return boards?.find((b) => b.id === selectedBoardId) ?? boards?.[0] ?? null;
  }, [boards, selectedBoardId]);

  const columns: ColumnType[] = board?.columns.slice().sort((a, b) => a.order - b.order) ?? [];

  useEffect(() => {
    if (!selectedBoardId && board) {
      setSelectedBoardId(board.id);
    }
  }, [board, selectedBoardId]);

  const handleAddCardOptimistic = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;
    const tempId = `temp-${Date.now()}`;
    const newCard: CardType = {
      id: tempId,
      content: 'New Card',
      order: column.cards.length,
      columnId,
    };
    column.cards.push(newCard);

    createCard.mutate(
      { content: newCard.content, order: newCard.order, columnId },
      {
        onSuccess: (createdCard) => {
          const index = column.cards.findIndex((c) => c.id === tempId);
          if (index !== -1) column.cards[index] = createdCard;
        },
        onError: () => {
          const index = column.cards.findIndex((c) => c.id === tempId);
          if (index !== -1) column.cards.splice(index, 1);
        },
      },
    );
  };

  const handleDeleteBoardOptimistic = (boardId: string) => {
    if (!boards) return;
    const index = boards.findIndex((b) => b.id === boardId);
    if (index === -1) return;
    const removed = boards[index];
    deleteBoard.mutate(boardId, {
      onError: () => boards.splice(index, 0, removed),
    });
  };

  const handleDeleteCardOptimistic = (columnId: string, cardId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;
    const index = column.cards.findIndex((c) => c.id === cardId);
    if (index === -1) return;
    const removed = column.cards[index];
    column.cards.splice(index, 1);
    deleteCard.mutate(cardId, {
      onError: () => column.cards.splice(index, 0, removed),
    });
  };

  const handleDeleteColumnOptimistic = (columnId: string) => {
    if (!board) return;
    const index = board.columns.findIndex((c) => c.id === columnId);
    if (index === -1) return;
    const removed = board.columns[index];
    board.columns.splice(index, 1);
    deleteColumn.mutate(columnId, {
      onError: () => board.columns.splice(index, 0, removed),
    });
  };

  const handleAddColumn = () => {
    if (!board) return;
    const tempId = `temp-${Date.now()}`;
    const newCol: ColumnType = {
      id: tempId,
      title: 'New Column',
      order: board.columns.length,
      cards: [],
    };
    board.columns.push(newCol);

    createColumn.mutate(
      { title: newCol.title, order: newCol.order, boardId: board.id },
      {
        onSuccess: (createdCol) => {
          const index = board.columns.findIndex((c) => c.id === tempId);
          if (index !== -1) board.columns[index] = createdCol;
        },
      },
    );
  };

  const handleCreateBoard = (title: string) => {
    if (!title.trim() || !ownerId) return;
    createBoard.mutate(
      { title: title.trim(), ownerId },
      {
        onSuccess: (newBoard) => {
          setSelectedBoardId(newBoard.id);
        },
      },
    );
  };

  const handleDragStart = (id: string) => {
    setActiveId(id);
    const allCards = columns.flatMap((col) => col.cards);
    const foundCard = allCards.find((c) => c.id === id);
    const foundColumn = columns.find((col) => col.id === id);

    if (foundCard) setActiveCard(foundCard);
    if (foundColumn) setActiveColumn(foundColumn);
  };

  const handleDragOver = (id: string | null) => {
    if (!id) return setOverId(null);
    const allCards = columns.flatMap((col) => col.cards);
    const isCard = allCards.some((c) => c.id === id);

    if (isCard) {
      const column = columns.find((col) => col.cards.some((c) => c.id === id));
      setOverId(column?.id ?? null);
    } else {
      setOverId(null);
    }
  };

  const handleDragEnd = (activeId: string, overId: string | null) => {
    setActiveId(null);
    setActiveCard(null);
    setActiveColumn(null);
    setOverId(null);
    if (!board || !overId || activeId === overId) return;

    const allCards = columns.flatMap((col) => col.cards);
    const isCardDrag = allCards.some((c) => c.id === activeId);

    if (isCardDrag) {
      const activeCard = allCards.find((c) => c.id === activeId);
      const overCard = allCards.find((c) => c.id === overId);
      if (!activeCard) return;

      const sourceColumn = columns.find((col) => col.id === activeCard.columnId);
      const targetColumn = overCard
        ? columns.find((col) => col.cards.some((c) => c.id === overCard.id))
        : columns.find((col) => col.id === overId);
      if (!sourceColumn || !targetColumn) return;

      const sourceIndex = sourceColumn.cards.findIndex((c) => c.id === activeId);
      const targetIndex = overCard
        ? targetColumn.cards.findIndex((c) => c.id === overCard.id)
        : targetColumn.cards.length;

      const movingCard = { ...activeCard, columnId: targetColumn.id };

      sourceColumn.cards.splice(sourceIndex, 1);
      targetColumn.cards.splice(targetIndex, 0, movingCard);

      [...sourceColumn.cards, ...targetColumn.cards].forEach((card, index) => {
        card.order = index;
        updateCard.mutate({
          cardId: card.id,
          content: card.content,
          order: card.order,
          columnId: card.columnId,
        });
      });
    } else {
      const oldIndex = columns.findIndex((c) => c.id === activeId);
      const newIndex = columns.findIndex((c) => c.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(columns, oldIndex, newIndex);

      reordered.forEach((col, index) => {
        col.order = index;
        updateColumn.mutate({
          columnId: col.id,
          title: col.title,
          order: col.order,
        });
      });
    }
  };

  return {
    board,
    boards,
    columns,
    isLoading,
    selectedBoardId,
    setSelectedBoardId,
    activeCard,
    activeColumn,
    activeId,
    overId,
    handleAddCardOptimistic,
    handleDeleteCardOptimistic,
    handleDeleteColumnOptimistic,
    handleDeleteBoardOptimistic,
    handleAddColumn,
    handleCreateBoard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    updateCard,
    updateColumn,
  };
}
