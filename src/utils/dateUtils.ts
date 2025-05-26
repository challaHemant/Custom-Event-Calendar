import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  addDays,
  addWeeks,
  addMonths as addMonthsFn,
  isBefore,
  isAfter,
} from 'date-fns';
import { DayWithEvents, EventItem, RecurrencePattern } from '../types';

// Generate days for the calendar month view
export const getCalendarDays = (date: Date, events: EventItem[]): DayWithEvents[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Get all days in the calendar view (includes days from prev/next months)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  return calendarDays.map(day => {
    // Filter events for this day including recurring events
    const dayEvents = events.filter(event => {
      const eventDate = parseISO(event.date);
      
      // Check if this is a direct match for the day
      if (isSameDay(day, eventDate)) {
        return true;
      }
      
      // Check if this is a recurring event that occurs on this day
      if (event.recurrence) {
        return isRecurringOnDate(event, day);
      }
      
      return false;
    });
    
    return {
      date: day,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
      events: dayEvents,
    };
  });
};

// Check if a recurring event occurs on a specific date
export const isRecurringOnDate = (event: EventItem, date: Date): boolean => {
  if (!event.recurrence) return false;
  
  const eventStartDate = parseISO(event.date);
  const recurrence = event.recurrence;
  
  // If the event start date is after the target date, it cannot occur on that date
  if (isBefore(date, eventStartDate)) return false;
  
  // If there's an end date and the target date is after it, it cannot occur on that date
  if (recurrence.endDate && isAfter(date, parseISO(recurrence.endDate))) return false;
  
  switch (recurrence.type) {
    case 'daily':
      // Check if the number of days between the start date and target date is divisible by the interval
      const daysDiff = Math.round((date.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff % recurrence.interval === 0;
      
    case 'weekly':
      // If specific days of week are set, check if the target date's day of week is included
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        const dayOfWeek = date.getDay();
        // Check if it's on the right day of week and the right week interval
        if (!recurrence.daysOfWeek.includes(dayOfWeek)) return false;
        
        // Calculate week number difference
        const weeksDiff = Math.floor((date.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        return weeksDiff % recurrence.interval === 0;
      } else {
        // Default to the same day of week as the original event
        const dayOfWeek = eventStartDate.getDay();
        const targetDayOfWeek = date.getDay();
        
        // Must be the same day of week
        if (dayOfWeek !== targetDayOfWeek) return false;
        
        // Calculate week number difference
        const weeksDiff = Math.floor((date.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        return weeksDiff % recurrence.interval === 0;
      }
      
    case 'monthly':
      // Check if it's the same day of the month
      if (eventStartDate.getDate() !== date.getDate()) return false;
      
      // Calculate month difference
      const monthsDiff = 
        (date.getFullYear() - eventStartDate.getFullYear()) * 12 + 
        (date.getMonth() - eventStartDate.getMonth());
      
      return monthsDiff % recurrence.interval === 0;
      
    case 'custom':
      // Custom handling - can be expanded based on requirements
      return false;
      
    default:
      return false;
  }
};

// Format date for display
export const formatDate = (date: Date, formatStr: string = 'PPP'): string => {
  return format(date, formatStr);
};

// Navigation functions
export const getNextMonth = (date: Date): Date => addMonths(date, 1);
export const getPreviousMonth = (date: Date): Date => subMonths(date, 1);

// Generate the next occurrence date for a recurring event
export const getNextOccurrence = (event: EventItem): Date | null => {
  if (!event.recurrence) return null;
  
  const eventDate = parseISO(event.date);
  const today = new Date();
  
  // If the event date is in the future, that's the next occurrence
  if (isAfter(eventDate, today)) return eventDate;
  
  const recurrence = event.recurrence;
  
  switch (recurrence.type) {
    case 'daily':
      // Calculate days since event
      const daysSinceEvent = Math.ceil((today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
      // Calculate days until next occurrence
      const daysUntilNext = recurrence.interval - (daysSinceEvent % recurrence.interval);
      // If today is an occurrence, return tomorrow's occurrence
      return daysUntilNext === recurrence.interval ? addDays(today, recurrence.interval) : addDays(today, daysUntilNext);
      
    case 'weekly':
      // If specific days of week are set
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        // Find the next day of week that occurs
        const todayDayOfWeek = today.getDay();
        // Sort days of week to find the next one
        const sortedDays = [...recurrence.daysOfWeek].sort((a, b) => a - b);
        
        // Find the next day of week
        const nextDayOfWeek = sortedDays.find(day => day > todayDayOfWeek);
        
        if (nextDayOfWeek !== undefined) {
          // Found a day later this week
          return addDays(today, nextDayOfWeek - todayDayOfWeek);
        } else {
          // Wrap to the first day of next week
          return addDays(today, 7 - todayDayOfWeek + sortedDays[0]);
        }
      } else {
        // Same day of week as the original event
        const dayOfWeek = eventDate.getDay();
        const todayDayOfWeek = today.getDay();
        
        // Calculate days until the next occurrence
        const daysUntilNext = (dayOfWeek + 7 - todayDayOfWeek) % 7;
        
        // If today is the day, add 7 days
        return daysUntilNext === 0 ? addDays(today, 7) : addDays(today, daysUntilNext);
      }
      
    case 'monthly':
      // Get the day of month
      const dayOfMonth = eventDate.getDate();
      const todayDate = today.getDate();
      
      if (todayDate < dayOfMonth) {
        // The next occurrence is this month
        const nextDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
        return nextDate;
      } else {
        // The next occurrence is next month
        const nextDate = new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth);
        return nextDate;
      }
      
    default:
      return null;
  }
};

// Check if two events conflict
export const doEventsConflict = (event1: EventItem, event2: EventItem): boolean => {
  // For now, we'll consider events on the same day as conflicting
  // This can be enhanced to check time conflicts as well
  const date1 = parseISO(event1.date);
  const date2 = parseISO(event2.date);
  
  return isSameDay(date1, date2);
};