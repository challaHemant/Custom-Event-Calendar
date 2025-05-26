import React from 'react';
import { Plus } from 'lucide-react';

interface AddEventButtonProps {
  onClick: () => void;
}

const AddEventButton: React.FC<AddEventButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Add event"
    >
      <Plus size={24} />
    </button>
  );
};

export default AddEventButton;