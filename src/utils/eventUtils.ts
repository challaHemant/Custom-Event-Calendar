import { v4 as uuidv4 } from 'uuid';
import { EventItem, EventFormData, RecurrenceType } from '../types';

// Create a new event
export const createEvent = (formData: EventFormData): EventItem => {
  const now = new Date().toISOString();
  
  return {
    ...formData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
};

// Update an existing event
export const updateEvent = (event: EventItem, formData: Partial<EventFormData>): EventItem => {
  return {
    ...event,
    ...formData,
    updatedAt: new Date().toISOString(),
  };
};

// Get available event colors
export const getEventColors = (): { id: string; name: string; value: string }[] => {
  return [
    { id: 'blue', name: 'Blue', value: '#3B82F6' },
    { id: 'green', name: 'Green', value: '#10B981' },
    { id: 'red', name: 'Red', value: '#EF4444' },
    { id: 'yellow', name: 'Yellow', value: '#F59E0B' },
    { id: 'purple', name: 'Purple', value: '#8B5CF6' },
    { id: 'pink', name: 'Pink', value: '#EC4899' },
    { id: 'indigo', name: 'Indigo', value: '#6366F1' },
    { id: 'gray', name: 'Gray', value: '#6B7280' },
  ];
};

// Get recurrence type options
export const getRecurrenceOptions = (): { id: RecurrenceType; name: string }[] => {
  return [
    { id: 'none', name: 'None' },
    { id: 'daily', name: 'Daily' },
    { id: 'weekly', name: 'Weekly' },
    { id: 'monthly', name: 'Monthly' },
    { id: 'custom', name: 'Custom' },
  ];
};

// Filter events by search query
export const filterEventsBySearch = (events: EventItem[], searchQuery: string): EventItem[] => {
  if (!searchQuery.trim()) {
    return events;
  }
  
  const query = searchQuery.toLowerCase().trim();
  
  return events.filter(
    event =>
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)
  );
};