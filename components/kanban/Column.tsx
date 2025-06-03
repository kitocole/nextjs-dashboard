// File: components/kanban/Column.tsx
'use client';

import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  useDeleteColumn,
  useUpdateColumn,
  useCreateCard,
  useUpdateCard,
} from '@/hooks/useKanbanBoard';
import Card from './Card';
import { ColumnType, CardType } from '@/types/kanban';
import { arrayMove } from '@dnd-kit/sortable';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export default function Column({ column }: { column: ColumnType }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
  });
  const [title, setTitle] = useState(column.title);
  const [editing, setEditing] = useState(false);
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();
  const createCard = useCreateCard();
  const updateCard = useUpdateCard();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    createCard.mutate({ content: 'New Card', order: column.cards.length, columnId: column.id });
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const sortedCards = [...column.cards].sort((a, b) => a.order - b.order);

  const handleCardDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = sortedCards.findIndex((c) => c.id === active.id);
    const newIndex = sortedCards.findIndex((c) => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(sortedCards, oldIndex, newIndex);
    newOrder.forEach((card, index) => (card.order = index));

    // Optimistically reorder local state
    column.cards = newOrder;

    // Sync with DB
    newOrder.forEach((card) => {
      updateCard.mutate({
        cardId: card.id,
        content: card.content,
        order: card.order,
        columnId: column.id,
      });
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-[50vh] w-[380px] overflow-y-auto rounded-md border bg-white shadow-sm dark:bg-neutral-900"
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCardDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={sortedCards.map((c) => c.id)}>
          <div className="p-2">
            {sortedCards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
            <button
              onClick={handleAddCard}
              className="bg-muted text-muted-foreground hover:bg-muted/70 mt-2 flex w-full items-center justify-center gap-1 rounded p-1 text-xs"
            >
              <Plus size={14} /> Add Card
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
