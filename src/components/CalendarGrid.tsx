import React from 'react';
import { format } from 'date-fns';
import { DayWithEvents } from '../types';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  days: DayWithEvents[];
  onDayClick: (date: Date) => void;
  onEventClick: (eventId: string) => void;
  onEventDrop: (eventId: string, date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  onDayClick,
  onEventClick,
  onEventDrop,
}) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white flex-1 overflow-hidden flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 text-center border-b">
        {dayNames.map((day, index) => (
          <div key={day} className={`py-2 text-sm font-medium text-gray-500 ${index === 0 || index === 6 ? 'text-red-400' : ''}`}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 h-full">
        {days.map((day, index) => (
          <CalendarDay
            key={format(day.date, 'yyyy-MM-dd')}
            day={day}
            onClick={() => onDayClick(day.date)}
            onEventClick={onEventClick}
            onEventDrop={onEventDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;