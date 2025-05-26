import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b px-4 py-3">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <h1 className="text-xl font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex space-x-1">
            <button
              onClick={onPrevMonth}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={onToday}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors ml-2"
              aria-label="Today"
            >
              <CalendarIcon size={20} />
            </button>
          </div>
        </div>
        
        <div className="w-full sm:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;