// File: app/(protected)/kanban/page.tsx
'use client';

import {
  useKanbanBoards,
  useCreateColumn,
  useUpdateColumn,
  useCreateBoard,
  useUpdateCard,
} from '@/hooks/useKanbanBoard';
import { useEffect, useMemo, useState } from 'react';
import { useKanbanStore } from '@/stores/kanbanStore';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import {
  DndContext,
  rectIntersection,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  Over,
  DragOverEvent,
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
import { ColumnType, CardType } from '@/types/kanban';
import { useSession } from 'next-auth/react';

export default function KanbanBoardPage() {
  const { data: boards, isLoading } = useKanbanBoards();
  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();
  const createBoard = useCreateBoard();
  const updateCard = useUpdateCard();
  const { selectedBoardId, setSelectedBoardId } = useKanbanStore();
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const { data: session } = useSession();
  const ownerId = session?.user?.id;

  const sensors = useSensors(useSensor(PointerSensor));

  const board = useMemo(
    () => boards?.find((b: { id: string }) => b.id === selectedBoardId) ?? boards?.[0],
    [boards, selectedBoardId],
  );

  useEffect(() => {
    if (!selectedBoardId && board) setSelectedBoardId(board.id);
  }, [board, selectedBoardId, setSelectedBoardId]);

  const columns =
    board?.columns.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [];

  const handleAddColumn = () => {
    if (!board) return;
    createColumn.mutate({ title: 'New Column', order: columns.length, boardId: board.id });
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const allCards = columns.flatMap((col) => col.cards);
    const found = allCards.find((c) => c.id === active.id);
    if (found) setActiveCard(found);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setOverId(null);
    if (!active || !over || active.id === over.id || !board) return;

    const allCards: CardType[] = columns.flatMap((col) => col.cards);
    const isCardDrag = allCards.some((c) => c.id === active.id);

    if (isCardDrag) {
      const activeCard = allCards.find((c) => c.id === active.id);
      const overCard = allCards.find((c) => c.id === over.id);

      if (!activeCard) return;

      const sourceColumn = columns.find((col) => col.id === activeCard.columnId);
      const targetColumn = overCard
        ? columns.find((col) => col.cards.some((c) => c.id === overCard.id))
        : columns.find((col) => col.id === over.id);

      if (!sourceColumn || !targetColumn) return;

      const sourceIndex = sourceColumn.cards.findIndex((c) => c.id === active.id);
      const targetIndex = overCard
        ? targetColumn.cards.findIndex((c) => c.id === overCard.id)
        : targetColumn.cards.length;

      const movingCard = { ...activeCard, columnId: targetColumn.id };

      sourceColumn.cards.splice(sourceIndex, 1);
      targetColumn.cards.splice(targetIndex, 0, movingCard);

      targetColumn.cards.forEach((card, index) => {
        card.order = index;
        updateCard.mutate({
          cardId: card.id,
          content: card.content,
          order: card.order,
          columnId: card.columnId,
        });
      });

      if (sourceColumn.id !== targetColumn.id) {
        sourceColumn.cards.forEach((card, index) => {
          card.order = index;
          updateCard.mutate({
            cardId: card.id,
            content: card.content,
            order: card.order,
            columnId: card.columnId,
          });
        });
      }
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
            {boards?.map((b) => (
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
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={columns.map((col) => col.id)}>
          <div className="flex gap-25 overflow-x-auto pb-4">
            {columns.length === 0 ? (
              <p className="text-muted-foreground">No columns yet.</p>
            ) : (
              columns.map((column: ColumnType) => (
                <div
                  key={column.id}
                  className={`w-[300px] shrink-0 transition-all duration-200 ease-in-out ${
                    overId === column.id ? 'bg-muted/40 border-primary border-2' : ''
                  }`}
                >
                  <Column column={column} />
                </div>
              ))
            )}
          </div>
        </SortableContext>
        <DragOverlay>{activeCard ? <Card card={activeCard} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
