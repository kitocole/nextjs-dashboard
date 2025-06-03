'use client';

import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDeleteColumn, useUpdateColumn, useCreateCard } from '@/hooks/useKanbanBoard';
import Card from './Card';
import { ColumnType } from '@/types/kanban';

export default function Column({
  column,
  activeCardId,
  overCardId,
  isColumnDragging,
  overColumnId,
}: {
  column: ColumnType;
  activeCardId: string | null;
  overCardId: string | null;
  isColumnDragging: boolean;
  overColumnId: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
  });

  const [title, setTitle] = useState(column.title);
  const [editing, setEditing] = useState(false);
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();
  const createCard = useCreateCard();

  const sortedCards = [...column.cards].sort((a, b) => a.order - b.order);

  const style = isColumnDragging
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : {};

  const handleTitleBlur = () => {
    if (title !== column.title) {
      updateColumn.mutate({ columnId: column.id, title, order: column.order });
    }
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this column?')) {
      deleteColumn.mutate(column.id);
    }
  };

  const handleAddCard = () => {
    createCard.mutate({
      content: 'New Card',
      order: sortedCards.length,
      columnId: column.id,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-[50vh] w-[380px] overflow-y-auto rounded-md border bg-white shadow-sm transition-all duration-200 ease-in-out dark:bg-neutral-900 ${
        overColumnId === column.id && !activeCardId ? 'ring-primary ring-2' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b p-2">
        <span {...attributes} {...listeners} className="text-muted-foreground cursor-grab">
          <GripVertical size={16} />
        </span>
        {editing ? (
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
            className="h-7 text-sm"
          />
        ) : (
          <h2
            className="w-full cursor-pointer truncate px-1 text-sm font-medium"
            onClick={() => setEditing(true)}
            title={title}
          >
            {title}
          </h2>
        )}
        <button onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
          <Trash2 size={16} />
        </button>
      </div>

      <SortableContext items={sortedCards.map((c) => c.id)}>
        <div className="p-2">
          {sortedCards.map((card) => (
            <div key={card.id}>
              {activeCardId && overCardId === card.id && card.id !== activeCardId && (
                <div className="bg-primary/50 h-2 rounded transition-all duration-150" />
              )}
              <Card card={card} />
            </div>
          ))}
          {activeCardId && overCardId && !sortedCards.find((c) => c.id === overCardId) && (
            <div className="bg-primary/50 h-2 rounded transition-all duration-150" />
          )}
          <button
            onClick={handleAddCard}
            className="bg-muted text-muted-foreground hover:bg-muted/70 mt-2 flex w-full items-center justify-center gap-1 rounded p-1 text-xs"
          >
            <Plus size={14} /> Add Card
          </button>
        </div>
      </SortableContext>
    </div>
  );
}
