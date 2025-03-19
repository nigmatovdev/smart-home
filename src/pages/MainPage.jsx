import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate();
  const [doors, setDoors] = useState([
    { id: 1, name: 'Front Door', status: 'Locked' },
    { id: 2, name: 'Back Door', status: 'Locked' },
    { id: 3, name: 'Garage Door', status: 'Locked' }
  ]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDoorAction = async (doorId, action) => {
    const token = localStorage.getItem('token');
    try {
      // TODO: Implement actual API call here
      setDoors(doors.map(door => {
        if (door.id === doorId) {
          return { ...door, status: action === 'lock' ? 'Locked' : 'Unlocked' };
        }
        return door;
      }));
    } catch (error) {
      console.error('Failed to control door:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Smart Door Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome back</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Door Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doors.map(door => (
              <div key={door.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{door.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    door.status === 'Locked' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {door.status}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDoorAction(door.id, 'unlock')}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={door.status === 'Unlocked'}
                  >
                    Unlock
                  </button>
                  <button
                    onClick={() => handleDoorAction(door.id, 'lock')}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    disabled={door.status === 'Locked'}
                  >
                    Lock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;