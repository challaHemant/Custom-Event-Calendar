import React from 'react';
import { format } from 'date-fns';
import { DayWithEvents } from '../types';
import EventItem from './EventItem';

interface CalendarDayProps {
  day: DayWithEvents;
  onClick: () => void;
  onEventClick: (eventId: string) => void;
  onEventDrop: (eventId: string, date: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onClick,
  onEventClick,
  onEventDrop,
}) => {
  const { date, isCurrentMonth, isToday, events } = day;
  
  // Handle drag over to allow dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    if (eventId) {
      onEventDrop(eventId, date);
    }
  };

  return (
    <div
      className={`border border-gray-200 min-h-[6rem] p-1 ${
        !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
      } ${isToday ? 'bg-blue-50' : ''}`}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex justify-between mb-1">
        <div
          className={`h-6 w-6 flex items-center justify-center text-sm rounded-full ${
            isToday
              ? 'bg-blue-500 text-white'
              : isCurrentMonth
              ? 'text-gray-700'
              : 'text-gray-400'
          }`}
        >
          {format(date, 'd')}
        </div>
      </div>
      
      <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
        {events.slice(0, 3).map(event => (
          <EventItem
            key={event.id}
            event={event}
            onClick={() => onEventClick(event.id)}
          />
        ))}
        
        {events.length > 3 && (
          <div className="text-xs text-gray-500 font-medium">
            + {events.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;