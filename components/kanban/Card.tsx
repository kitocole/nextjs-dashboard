'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CardType } from '@/types/kanban';

export default function Card({
  card,
  onDelete,
  onUpdate = () => {},
}: {
  card: CardType;
  onDelete: () => void;
  onUpdate?: (content: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: card.id,
  });

  const [content, setContent] = useState(card.content);
  const [editing, setEditing] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleBlur = () => {
    setEditing(false);
    if (content !== card.content) onUpdate(content);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 min-h-[56px] rounded border bg-white p-2 text-sm shadow-sm dark:bg-neutral-800"
    >
      <div className="flex items-center justify-between">
        <span {...attributes} {...listeners} className="text-muted-foreground cursor-grab">
          <GripVertical size={14} />
        </span>
        <button onClick={onDelete} className="text-muted-foreground hover:text-destructive">
          <Trash2 size={14} />
        </button>
      </div>
      {editing ? (
        <Input
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
          className="mt-1 h-7 text-sm"
        />
      ) : (
        <p className="mt-1 cursor-pointer break-words" onClick={() => setEditing(true)}>
          {content}
        </p>
      )}
    </div>
  );
}
