import React from 'react';
import { format, parseISO } from 'date-fns';
import { EventItem as EventItemType } from '../types';

interface EventListProps {
  events: EventItemType[];
  onEventClick: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  // Group events by date
  const eventsByDate = events.reduce((acc: { [key: string]: EventItemType[] }, event) => {
    const dateKey = format(parseISO(event.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  // Sort dates chronologically
  const sortedDates = Object.keys(eventsByDate).sort();

  if (events.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No events found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h3 className="font-medium text-lg p-4 border-b">Upcoming Events</h3>
      <div className="divide-y">
        {sortedDates.map(dateKey => (
          <div key={dateKey} className="p-3">
            <div className="text-sm font-medium text-gray-600 mb-2">
              {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="space-y-2">
              {eventsByDate[dateKey].map(event => (
                <div
                  key={event.id}
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => onEventClick(event.id)}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {format(parseISO(event.date), 'h:mm a')}
                      {event.recurrence && (
                        <span className="ml-2 text-gray-400">
                          (Recurring: {event.recurrence.type})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;