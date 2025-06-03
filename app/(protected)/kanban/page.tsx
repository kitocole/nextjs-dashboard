// File: app/(protected)/kanban/page.tsx
'use client';

import {
  useKanbanBoards,
  useCreateColumn,
  useUpdateColumn,
  useCreateBoard,
} from '@/hooks/useKanbanBoard';
import { useEffect, useMemo, useState } from 'react';
import { useKanbanStore } from '@/stores/kanbanStore';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import {
  DndContext,
  rectIntersection,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
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
import { ColumnType } from '@/types/kanban';
import { useSession } from 'next-auth/react';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

export default function KanbanBoardPage() {
  const { data: boards, isLoading } = useKanbanBoards();
  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();
  const createBoard = useCreateBoard();
  const { selectedBoardId, setSelectedBoardId } = useKanbanStore();
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id || !board) return;

    const oldIndex = columns.findIndex((c: ColumnType) => c.id === active.id);
    const newIndex = columns.findIndex((c: ColumnType) => c.id === over.id);
    const newOrder: ColumnType[] = arrayMove(columns, oldIndex, newIndex);

    // Optimistically update column order client-side
    newOrder.forEach((col, i) => {
      col.order = i;
    });
    board.columns = newOrder;

    // Sync changes to backend
    newOrder.forEach((col) => {
      updateColumn.mutate({ columnId: col.id, title: col.title, order: col.order });
    });
  };

  if (!isLoading && (!boards || boards.length === 0)) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-2xl font-semibold">Create a Kanban Board</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Board title"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
          />
          <Button onClick={handleCreateBoard}>Create</Button>
        </div>
      </div>
    );
  }

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
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columns.map((col) => col.id)}>
          <div className="flex gap-25 overflow-x-auto pb-4">
            {columns.length === 0 ? (
              <p className="text-muted-foreground">No columns yet.</p>
            ) : (
              columns.map((column: ColumnType) => (
                <div key={column.id} className="w-[300px] shrink-0">
                  <Column column={column} />
                </div>
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
