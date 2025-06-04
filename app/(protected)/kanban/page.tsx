// Fixed and polished page.tsx with optimistic updates (includes fallback for missing cards)
'use client';

import {
  useKanbanBoards,
  useCreateColumn,
  useUpdateColumn,
  useCreateBoard,
  useUpdateCard,
  useDeleteColumn,
  useDeleteCard,
  useCreateCard,
} from '@/hooks/useKanbanBoard';
import { useEffect, useMemo, useState } from 'react';
import { useKanbanStore } from '@/stores/kanbanStore';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import Column from '@/components/kanban/Column';
import Card from '@/components/kanban/Card';
import { ColumnType, CardType, BoardType } from '@/types/kanban';
import { useSession } from 'next-auth/react';
import SkeletonColumn from '@/components/kanban/SkeletonColumns';

export default function KanbanBoardPage() {
  const { data: boards, isLoading } = useKanbanBoards();
  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();
  const createBoard = useCreateBoard();
  const updateCard = useUpdateCard();
  const deleteColumn = useDeleteColumn();
  const deleteCard = useDeleteCard();
  const createCard = useCreateCard();

  const { selectedBoardId, setSelectedBoardId } = useKanbanStore();
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const { data: session } = useSession();
  const ownerId = session?.user?.id;

  const sensors = useSensors(useSensor(PointerSensor));

  const board: BoardType | undefined = useMemo(
    () => boards?.find((b: BoardType) => b.id === selectedBoardId) ?? boards?.[0],
    [boards, selectedBoardId],
  );

  useEffect(() => {
    if (!selectedBoardId && board) setSelectedBoardId(board.id);
  }, [board, selectedBoardId, setSelectedBoardId]);

  const columns: ColumnType[] = board?.columns.sort((a, b) => a.order - b.order) || [];

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

  const handleAddCardOptimistic = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;
    const tempId = `temp-${Date.now()}`;
    const newCard = { id: tempId, content: 'New Card', order: column.cards.length, columnId };
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

  const handleAddColumn = () => {
    if (!board) return;
    const tempId = `temp-${Date.now()}`;
    const optimisticColumn = { id: tempId, title: 'New Column', order: columns.length, cards: [] };
    board.columns.push(optimisticColumn);

    createColumn.mutate(
      { title: 'New Column', order: columns.length, boardId: board.id },
      {
        onSuccess: (data) => {
          const index = board.columns.findIndex((c) => c.id === tempId);
          if (index !== -1) board.columns[index] = data;
        },
      },
    );
  };

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim() || !ownerId) return;
    createBoard.mutate(
      { title: newBoardTitle.trim(), ownerId },
      {
        onSuccess: (newBoard) => {
          setNewBoardTitle('');
          setSelectedBoardId(newBoard.id);
          setIsDialogOpen(false);
        },
      },
    );
  };

  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event;
    setActiveId(active.id as string);

    const allCards = columns.flatMap((col) => col.cards ?? []);
    const foundCard = allCards.find((c) => c.id === active.id);
    const foundColumn = columns.find((col) => col.id === active.id);

    if (foundCard) setActiveCard(foundCard);
    if (foundColumn) setActiveColumn(foundColumn);
  };

  const handleDragOver = (event: DragOverEvent): void => {
    const { over } = event;
    if (!over) return setOverId(null);

    const overIdRaw = String(over.id);
    const allCards = columns.flatMap((col) => col.cards ?? []);
    const isCard = allCards.some((c) => c.id === overIdRaw);

    if (isCard) {
      const col = columns.find((col) => col.cards?.some((card) => card.id === overIdRaw));
      setOverId(col?.id ?? null);
    } else {
      setOverId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);
    setOverId(null);
    setActiveId(null);

    if (!active || !over || active.id === over.id || !board) return;

    const allCards: CardType[] = columns.flatMap((col) => col.cards ?? []);
    const isCardDrag = allCards.some((c) => c.id === active.id);

    if (isCardDrag) {
      const activeCard = allCards.find((c) => c.id === active.id);
      const overCard = allCards.find((c) => c.id === over.id);
      if (!activeCard) return;

      const sourceColumn = columns.find((col) => col.id === activeCard.columnId);
      const targetColumn = overCard
        ? columns.find((col) => col.cards?.some((c) => c.id === overCard.id))
        : columns.find((col) => col.id === over.id);
      if (!sourceColumn || !targetColumn) return;

      const sourceIndex = sourceColumn.cards.findIndex((c) => c.id === active.id);
      const targetIndex = overCard
        ? targetColumn.cards.findIndex((c) => c.id === overCard.id)
        : targetColumn.cards.length;

      const movingCard: CardType = { ...activeCard, columnId: targetColumn.id };

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
      const oldIndex = columns.findIndex((c) => c.id === active.id);
      const newIndex = columns.findIndex((c) => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = arrayMove(columns, oldIndex, newIndex);
      newOrder.forEach((col, index) => {
        col.order = index;
        updateColumn.mutate({
          columnId: col.id,
          title: col.title,
          order: col.order,
        });
      });
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            className="rounded border px-2 py-1 text-sm dark:bg-neutral-900"
            value={selectedBoardId ?? ''}
            onChange={(e) => setSelectedBoardId(e.target.value)}
          >
            {boards?.map((b: BoardType) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                + New Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
              </DialogHeader>
              <Input
                autoFocus
                placeholder="Board title"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
              />
              <Button onClick={handleCreateBoard}>Create</Button>
            </DialogContent>
          </Dialog>
        </div>
        <Button onClick={handleAddColumn} size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add Column
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={columns.map((col) => col.id)}>
          <div className="flex gap-22 overflow-x-auto pb-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonColumn key={i} />)
            ) : columns.length === 0 ? (
              <p className="text-muted-foreground">No columns yet.</p>
            ) : (
              columns.map((column) => (
                <div
                  key={column.id}
                  className="w-[300px] shrink-0 transition-all duration-200 ease-in-out"
                >
                  <Column
                    column={{ ...column, cards: column.cards ?? [] }}
                    activeCardId={activeCard?.id || null}
                    overCardId={activeCard ? overId : null}
                    isColumnDragging={!activeCard && activeId === column.id}
                    overColumnId={null}
                    onAddCard={handleAddCardOptimistic}
                    onDeleteCard={handleDeleteCardOptimistic}
                    onDeleteColumn={handleDeleteColumnOptimistic}
                    onUpdateCard={(cardId, content, order, columnId) =>
                      updateCard.mutate({ cardId, content, order, columnId })
                    }
                  />
                </div>
              ))
            )}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeCard ? (
            <Card card={activeCard} onDelete={() => {}} onUpdate={() => {}} />
          ) : activeColumn ? (
            <Column
              column={{ ...activeColumn, cards: activeColumn.cards ?? [] }}
              activeCardId={null}
              overCardId={null}
              isColumnDragging={true}
              overColumnId={null}
              onAddCard={() => {}}
              onDeleteCard={() => {}}
              onDeleteColumn={() => {}}
              onUpdateCard={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
