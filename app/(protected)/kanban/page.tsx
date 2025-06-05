'use client';

import {
  useSensors,
  useSensor,
  PointerSensor,
  DndContext,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Plus, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useKanbanLogic } from '@/hooks/useKanbanLogic';
import Column from '@/components/kanban/Column';
import Card from '@/components/kanban/Card';
import SkeletonColumn from '@/components/kanban/SkeletonColumns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function KanbanBoardPage() {
  const sensors = useSensors(useSensor(PointerSensor));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  const {
    boards,
    columns,
    selectedBoardId,
    isLoading,
    activeCard,
    activeColumn,
    activeId,
    setSelectedBoardId,
    handleAddColumn,
    handleAddCardOptimistic,
    handleDeleteCardOptimistic,
    handleDeleteColumnOptimistic,
    handleDeleteBoardOptimistic,
    handleCreateBoard,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    updateCard,
    updateColumn,
  } = useKanbanLogic();

  const handleBoardDelete = () => {
    if (!selectedBoardId) return;
    handleDeleteBoardOptimistic(selectedBoardId);
    toast.success('Board deleted');
  };

  const handleCreateBoardSubmit = () => {
    const trimmed = newBoardTitle.trim();
    if (!trimmed) return;
    handleCreateBoard(trimmed);
    toast.success('Board created');
    setNewBoardTitle('');
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Board Selector */}
          <select
            className="rounded border px-3 py-2 text-base dark:bg-neutral-900"
            value={selectedBoardId ?? ''}
            onChange={(e) => setSelectedBoardId(e.target.value)}
          >
            {boards?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>

          {/* Create New Board Dialog */}
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
                onKeyDown={(e) => e.key === 'Enter' && handleCreateBoardSubmit()}
              />
              <Button onClick={handleCreateBoardSubmit}>Create</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Board Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={handleAddColumn} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add Column
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBoardDelete} className="text-destructive">
                Delete Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* DnD Area */}
      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragStart={(event) => handleDragStart(event.active.id.toString())}
        onDragOver={(event) => handleDragOver(event.over?.id?.toString() ?? null)}
        onDragEnd={(event) =>
          handleDragEnd(event.active.id.toString(), event.over?.id?.toString() ?? null)
        }
      >
        <SortableContext items={columns.map((col) => col.id)}>
          <div className="flex gap-22 overflow-x-auto pb-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonColumn key={i} />)
            ) : columns.length === 0 ? (
              <p className="text-muted-foreground">No columns yet.</p>
            ) : (
              columns.map((column) => (
                <div key={column.id} className="w-[300px] shrink-0">
                  <Column
                    column={{ ...column, cards: column.cards ?? [] }}
                    isColumnDragging={!activeCard && activeId === column.id}
                    onAddCard={handleAddCardOptimistic}
                    onDeleteCard={handleDeleteCardOptimistic}
                    onDeleteColumn={handleDeleteColumnOptimistic}
                    onUpdateColumn={(columnId, title, order) =>
                      updateColumn.mutate({ columnId, title, order })
                    }
                    onUpdateCard={(cardId, content, order, columnId) =>
                      updateCard.mutate({ cardId, content, order, columnId })
                    }
                  />
                </div>
              ))
            )}
          </div>
        </SortableContext>

        {/* Drag Preview */}
        <DragOverlay>
          {activeCard ? (
            <Card card={activeCard} />
          ) : activeColumn ? (
            <Column
              column={{ ...activeColumn, cards: activeColumn.cards ?? [] }}
              isColumnDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
