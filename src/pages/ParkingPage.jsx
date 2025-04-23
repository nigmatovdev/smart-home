import { useState, useEffect } from 'react';
import BottomNavbar from '../components/BottomNavbar';
import HouseSelector from '../components/HouseSelector';

function ParkingPage() {
  const [selectedHouse, setSelectedHouse] = useState(() => {
    return localStorage.getItem('selectedHouse') || 'house1';
  });
  const [cars, setCars] = useState(() => {
    const savedCars = localStorage.getItem(`parkingCars_${selectedHouse}`);
    return savedCars ? JSON.parse(savedCars) : [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [carToEdit, setCarToEdit] = useState(null);
  const [newCar, setNewCar] = useState({
    plateNumber: '',
    model: '',
    color: ''
  });

  // Update cars when house changes
  useEffect(() => {
    const savedCars = localStorage.getItem(`parkingCars_${selectedHouse}`);
    setCars(savedCars ? JSON.parse(savedCars) : []);
  }, [selectedHouse]);

  // Save to localStorage whenever cars change
  useEffect(() => {
    localStorage.setItem(`parkingCars_${selectedHouse}`, JSON.stringify(cars));
  }, [cars, selectedHouse]);

  const handleAddCar = (e) => {
    e.preventDefault();
    if (cars.length >= 2) return;

    const carWithId = {
      ...newCar,
      id: Date.now(),
      addedAt: new Date().toISOString()
    };

    setCars([...cars, carWithId]);
    setNewCar({ plateNumber: '', model: '', color: '' });
    setShowAddForm(false);
  };

  const handleEditCar = (car) => {
    setCarToEdit(car);
    setNewCar({
      plateNumber: car.plateNumber,
      model: car.model,
      color: car.color
    });
    setShowEditForm(true);
  };

  const handleUpdateCar = (e) => {
    e.preventDefault();
    setCars(cars.map(car => 
      car.id === carToEdit.id 
        ? { ...car, ...newCar, updatedAt: new Date().toISOString() }
        : car
    ));
    setNewCar({ plateNumber: '', model: '', color: '' });
    setShowEditForm(false);
    setCarToEdit(null);
  };

  const handleRemoveCar = (id) => {
    const car = cars.find(c => c.id === id);
    setCarToDelete(car);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (carToDelete) {
      setCars(cars.filter(car => car.id !== carToDelete.id));
      setShowDeleteConfirm(false);
      setCarToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCarToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Parking</h1>
            {cars.length < 2 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 p-4">
        <div className="mb-4">
          <HouseSelector onHouseChange={setSelectedHouse} />
        </div>
        {/* Add/Edit Car Form */}
        {(showAddForm || showEditForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100">
              <h2 className="text-xl font-bold mb-4">{showEditForm ? 'Edit Car' : 'Add New Car'}</h2>
              <form onSubmit={showEditForm ? handleUpdateCar : handleAddCar}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plateNumber">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    id="plateNumber"
                    value={newCar.plateNumber}
                    onChange={(e) => setNewCar({ ...newCar, plateNumber: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="ABC 123"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                    Model
                  </label>
                  <input
                    type="text"
                    id="model"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Toyota Camry"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                    Color
                  </label>
                  <input
                    type="text"
                    id="color"
                    value={newCar.color}
                    onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Red"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setShowEditForm(false);
                      setNewCar({ plateNumber: '', model: '', color: '' });
                      setCarToEdit(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                  >
                    {showEditForm ? 'Update' : 'Add'} Car
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && carToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Remove Car</h2>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to remove {carToDelete.model} ({carToDelete.plateNumber})?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cars List */}
        <div className="space-y-4">
          {cars.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No cars added yet</p>
              <p className="text-gray-400 text-sm mt-2">Click the + button to add a car</p>
            </div>
          ) : (
            cars.map((car) => (
              <div 
                key={car.id} 
                className="bg-white rounded-lg shadow p-4 transform transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{car.model}</h3>
                        <p className="text-gray-600">Plate: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{car.plateNumber}</span></p>
                        <p className="text-gray-600">Color: <span className="capitalize">{car.color}</span></p>
                        <p className="text-xs text-gray-400 mt-1">Added: {formatDate(car.addedAt)}</p>
                        {car.updatedAt && (
                          <p className="text-xs text-gray-400">Updated: {formatDate(car.updatedAt)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCar(car)}
                      className="text-blue-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveCar(car.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}

export default ParkingPage;