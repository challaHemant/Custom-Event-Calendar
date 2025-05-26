import { useState, useEffect } from 'react';
import { DayWithEvents, EventItem } from '../types';
import { getCalendarDays, getPreviousMonth, getNextMonth } from '../utils/dateUtils';
import { loadEvents, saveEvents, addEvent, updateStoredEvent, deleteEvent } from '../utils/storageUtils';
import { filterEventsBySearch } from '../utils/eventUtils';

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [days, setDays] = useState<DayWithEvents[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);

  // Load events from storage on initial mount
  useEffect(() => {
    const storedEvents = loadEvents();
    setEvents(storedEvents);
  }, []);

  // Update calendar days when current date or events change
  useEffect(() => {
    setDays(getCalendarDays(currentDate, events));
  }, [currentDate, events]);

  // Filter events when search query changes
  useEffect(() => {
    setFilteredEvents(filterEventsBySearch(events, searchQuery));
  }, [events, searchQuery]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(getPreviousMonth(currentDate));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(getNextMonth(currentDate));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Add a new event
  const handleAddEvent = (newEvent: EventItem) => {
    const updatedEvents = addEvent(newEvent);
    setEvents(updatedEvents);
  };

  // Update an existing event
  const handleUpdateEvent = (updatedEvent: EventItem) => {
    const updatedEvents = updateStoredEvent(updatedEvent);
    setEvents(updatedEvents);
  };

  // Delete an event
  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = deleteEvent(eventId);
    setEvents(updatedEvents);
  };

  // Move an event to a new date (for drag and drop)
  const handleMoveEvent = (eventId: string, newDate: Date) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Create a new event with the updated date
    const updatedEvent = {
      ...event,
      date: newDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update the event
    handleUpdateEvent(updatedEvent);
  };

  return {
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
  };
};