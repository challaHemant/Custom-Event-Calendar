import React from 'react';
import { format, parseISO } from 'date-fns';
import { EventItem as EventItemType } from '../types';

interface EventItemProps {
  event: EventItemType;
  onClick: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onClick }) => {
  // Handle drag start to set the event ID
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', event.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div
      className="px-2 py-1 rounded text-xs truncate cursor-pointer transition-transform hover:transform hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: event.color, color: '#fff' }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="font-medium truncate">{event.title}</div>
      {event.recurrence && (
        <div className="text-[10px] opacity-90 flex items-center">
          <span className="mr-1">↻</span>
          {event.recurrence.type === 'daily' && 'Daily'}
          {event.recurrence.type === 'weekly' && 'Weekly'}
          {event.recurrence.type === 'monthly' && 'Monthly'}
          {event.recurrence.type === 'custom' && 'Custom'}
        </div>
      )}
    </div>
  );
};

export default EventItem;