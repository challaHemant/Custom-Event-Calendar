import { EventItem } from '../types';

const EVENTS_STORAGE_KEY = 'calendar_events';

// Load events from local storage
export const loadEvents = (): EventItem[] => {
  try {
    const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Failed to load events from localStorage:', error);
    return [];
  }
};

// Save events to local storage
export const saveEvents = (events: EventItem[]): void => {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events to localStorage:', error);
  }
};

// Add a new event
export const addEvent = (event: EventItem): EventItem[] => {
  const events = loadEvents();
  const updatedEvents = [...events, event];
  saveEvents(updatedEvents);
  return updatedEvents;
};

// Update an existing event
export const updateStoredEvent = (updatedEvent: EventItem): EventItem[] => {
  const events = loadEvents();
  const updatedEvents = events.map(event => 
    event.id === updatedEvent.id ? updatedEvent : event
  );
  saveEvents(updatedEvents);
  return updatedEvents;
};

// Delete an event
export const deleteEvent = (eventId: string): EventItem[] => {
  const events = loadEvents();
  const updatedEvents = events.filter(event => event.id !== eventId);
  saveEvents(updatedEvents);
  return updatedEvents;
};