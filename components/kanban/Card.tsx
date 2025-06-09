'use client';

import { memo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CardType } from '@/types/kanban';

type CardProps = {
  card: CardType;
  isCardDragging?: boolean;
  onDelete?: () => void;
  onUpdate?: (content: string) => void;
};

function CardComponent({
  card,
  isCardDragging = false,
  onDelete = () => {},
  onUpdate = () => {},
}: CardProps) {
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
      className={`mb-2 min-h-[56px] rounded border bg-white p-2 text-sm shadow-sm transition-transform duration-200 ease-in-out dark:bg-neutral-800 ${
        isCardDragging ? 'opacity-50' : ''
      }`}
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

function areEqual(prev: CardProps, next: CardProps) {
  return (
    prev.card.id === next.card.id &&
    prev.card.content === next.card.content &&
    prev.card.order === next.card.order &&
    prev.card.columnId === next.card.columnId &&
    prev.onDelete === next.onDelete &&
    prev.onUpdate === next.onUpdate
  );
}

export default memo(CardComponent, areEqual);
