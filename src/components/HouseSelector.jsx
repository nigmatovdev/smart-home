import { useState, useEffect } from 'react';

const HouseSelector = ({ onHouseChange }) => {
  const [selectedHouse, setSelectedHouse] = useState(() => {
    return localStorage.getItem('selectedHouse') || 'house1';
  });
  const [isOpen, setIsOpen] = useState(false);

  const houses = [
    { id: 'house1', name: 'Home 1' },
    { id: 'house2', name: 'Home 2' }
  ];

  useEffect(() => {
    localStorage.setItem('selectedHouse', selectedHouse);
    if (onHouseChange) {
      onHouseChange(selectedHouse);
    }
  }, [selectedHouse, onHouseChange]);

  const handleHouseChange = (houseId) => {
    setSelectedHouse(houseId);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium">{houses.find(h => h.id === selectedHouse)?.name}</span>
        <svg 
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg z-50">
          {houses.map((house) => (
            <button
              key={house.id}
              onClick={() => handleHouseChange(house.id)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                selectedHouse === house.id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {house.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HouseSelector; 