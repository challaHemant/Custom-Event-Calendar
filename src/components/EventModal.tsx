import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { X, Calendar, Clock, AlignLeft, Repeat, Palette } from 'lucide-react';
import { EventItem, EventFormData, RecurrenceType } from '../types';
import { getEventColors, getRecurrenceOptions, createEvent, updateEvent } from '../utils/eventUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventItem) => void;
  onDelete?: (eventId: string) => void;
  initialDate?: Date;
  event?: EventItem;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  event,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    description: '',
    color: '#3B82F6', // Default blue
    recurrence: null,
  });

  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);

  // Initialize form data when modal opens or event changes
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        endDate: event.endDate,
        description: event.description,
        color: event.color,
        recurrence: event.recurrence,
      });
      setRecurrenceType(event.recurrence?.type || 'none');
      setRecurrenceInterval(event.recurrence?.interval || 1);
      setRecurrenceDays(event.recurrence?.daysOfWeek || []);
    } else if (initialDate) {
      setFormData({
        ...formData,
        date: initialDate.toISOString(),
      });
      setRecurrenceType('none');
      setRecurrenceInterval(1);
      setRecurrenceDays([]);
    }
  }, [isOpen, event, initialDate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleRecurrenceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as RecurrenceType;
    setRecurrenceType(value);
    
    // Reset recurrence data if set to none
    if (value === 'none') {
      setFormData(prev => ({ ...prev, recurrence: null }));
    } else {
      setFormData(prev => ({
        ...prev,
        recurrence: {
          type: value,
          interval: recurrenceInterval,
          daysOfWeek: value === 'weekly' ? recurrenceDays : undefined,
        },
      }));
    }
  };

  const handleRecurrenceIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interval = parseInt(e.target.value) || 1;
    setRecurrenceInterval(interval);
    
    if (recurrenceType !== 'none') {
      setFormData(prev => ({
        ...prev,
        recurrence: {
          ...prev.recurrence!,
          interval,
        },
      }));
    }
  };

  const handleDayOfWeekToggle = (day: number) => {
    const newDays = recurrenceDays.includes(day)
      ? recurrenceDays.filter(d => d !== day)
      : [...recurrenceDays, day];
    
    setRecurrenceDays(newDays);
    
    if (recurrenceType === 'weekly') {
      setFormData(prev => ({
        ...prev,
        recurrence: {
          ...prev.recurrence!,
          daysOfWeek: newDays,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create or update the event
    if (event) {
      onSave(updateEvent(event, formData));
    } else {
      onSave(createEvent(formData));
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  const colors = getEventColors();
  const recurrenceOptions = getRecurrenceOptions();
  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {event ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Event Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
              required
            />
          </div>

          {/* Event Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Date</span>
              </div>
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date ? format(parseISO(formData.date), "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Event Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <AlignLeft size={16} />
                <span>Description</span>
              </div>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add a description"
            />
          </div>

          {/* Event Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Palette size={16} />
                <span>Color</span>
              </div>
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color.value ? 'border-gray-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Recurrence Options */}
          <div>
            <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Repeat size={16} />
                <span>Recurrence</span>
              </div>
            </label>
            <select
              id="recurrence"
              name="recurrence"
              value={recurrenceType}
              onChange={handleRecurrenceTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {recurrenceOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recurrence Details */}
          {recurrenceType !== 'none' && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-md">
              <div>
                <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat every
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="interval"
                    value={recurrenceInterval}
                    onChange={handleRecurrenceIntervalChange}
                    min={1}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {recurrenceType === 'daily' ? 'day(s)' : 
                     recurrenceType === 'weekly' ? 'week(s)' :
                     recurrenceType === 'monthly' ? 'month(s)' : 'custom'}
                  </span>
                </div>
              </div>

              {/* Days of Week Selector for Weekly Recurrence */}
              {recurrenceType === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat on
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleDayOfWeekToggle(day.value)}
                        className={`w-10 h-10 rounded-full ${
                          recurrenceDays.includes(day.value)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            {event && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            ) : (
              <div></div>
            )}
            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {event ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;