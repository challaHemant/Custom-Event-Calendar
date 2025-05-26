import React, { useState } from 'react';
import { format } from 'date-fns';
import { useCalendar } from './hooks/useCalendar';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import EventModal from './components/EventModal';
import EventList from './components/EventList';
import AddEventButton from './components/AddEventButton';
import { EventItem } from './types';

function App() {
  const {
    currentDate,
    days,
    events,
    filteredEvents,
    searchQuery,
    setSearchQuery,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleMoveEvent,
  } = useCalendar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | undefined>(undefined);

  // Handle day click to open modal with the selected date
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  // Handle event click to open modal with the selected event
  const handleEventClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedDate(null);
      setIsModalOpen(true);
    }
  };

  // Handle add button click
  const handleAddButtonClick = () => {
    setSelectedDate(new Date());
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  // Handle save event
  const handleSaveEvent = (event: EventItem) => {
    if (selectedEvent) {
      handleUpdateEvent(event);
    } else {
      handleAddEvent(event);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <CalendarGrid
            days={days}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventDrop={handleMoveEvent}
          />
        </div>
        
        {/* Event list sidebar */}
        <div className="hidden md:block w-80 bg-gray-50 border-l overflow-y-auto p-4">
          <EventList
            events={searchQuery ? filteredEvents : events}
            onEventClick={handleEventClick}
          />
        </div>
      </div>
      
      {/* Add event button */}
      <AddEventButton onClick={handleAddButtonClick} />
      
      {/* Event modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialDate={selectedDate || undefined}
        event={selectedEvent}
      />
    </div>
  );
}

export default App;