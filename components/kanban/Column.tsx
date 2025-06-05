'use client';

import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Card from './Card';
import { ColumnType } from '@/types/kanban';
import React from 'react';

type ColumnProps = {
  column: ColumnType;
  isColumnDragging: boolean;
  onAddCard?: (columnId: string) => void;
  onDeleteCard?: (columnId: string, cardId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onUpdateCard?: (cardId: string, content: string, order: number, columnId: string) => void;
  onUpdateColumn?: (columnId: string, title: string, order: number) => void;
};

const Column = React.memo(
  ({
    column,
    isColumnDragging,
    onAddCard = () => {},
    onDeleteCard = () => {},
    onDeleteColumn = () => {},
    onUpdateCard = () => {},
    onUpdateColumn = () => {},
  }: ColumnProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: column.id,
    });

    const [title, setTitle] = useState(column.title);
    const [editing, setEditing] = useState(false);

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const sortedCards = [...(column.cards ?? [])].sort((a, b) => a.order - b.order);

    const handleTitleBlur = () => {
      setEditing(false);
      const trimmed = title.trim();
      if (!trimmed || trimmed === column.title) {
        setTitle(column.title);
        return;
      }
      onUpdateColumn(column.id, trimmed, column.order);
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`h-[50vh] w-[380px] rounded-md border bg-white shadow-sm transition-transform duration-200 ease-in-out dark:bg-neutral-900 ${
          isColumnDragging ? 'opacity-50' : ''
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

          <button
            onClick={() => onDeleteColumn(column.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <SortableContext items={sortedCards.map((c) => c.id)}>
          <div className="p-2">
            {sortedCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onDelete={() => onDeleteCard(column.id, card.id)}
                onUpdate={(newContent) => onUpdateCard(card.id, newContent, card.order, column.id)}
              />
            ))}

            <button
              onClick={() => onAddCard(column.id)}
              className="bg-muted text-muted-foreground hover:bg-muted/70 mt-2 flex w-full items-center justify-center gap-1 rounded p-1 text-xs"
            >
              <Plus size={14} /> Add Card
            </button>
          </div>
        </SortableContext>
      </div>
    );
  },
);

Column.displayName = 'Column';
export default Column;
