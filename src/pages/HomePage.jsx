import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';
import IntercomStream from '../components/IntercomStream';
import HouseSelector from '../components/HouseSelector';

function HomePage() {
  const [selectedHouse, setSelectedHouse] = useState(() => {
    return localStorage.getItem('selectedHouse') || 'house1';
  });

  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Load parking data for the selected house
    const savedCars = localStorage.getItem(`parkingCars_${selectedHouse}`);
    setCars(savedCars ? JSON.parse(savedCars) : []);
  }, [selectedHouse]);

  // Camera configurations for preview
  const cameraConfigs = {
    house1: {
      "33bf385c-cdf0-472e-9baf-c67871b33e9c": {
        "name": "Главный вход",
        "channels": {
          "0": {
            "url": "rtsp://admin:12345678a@10.10.100.125:554/Streaming/Channels/101",
            "on_demand": true,
            "status": 1
          }
        }
      }
    },
    house2: {
      "e8d60039-5a7d-4cd8-9a95-321bee492cb9": {
        "name": "Задний вход",
        "channels": {
          "0": {
            "url": "rtsp://admin:12345678a@10.10.100.126:554/Streaming/Channels/101",
            "on_demand": true
          }
        }
      }
    }
  };

  // Intercom configurations
  const intercomConfigs = {
    house1: {
      uuid: "c3b1c7dc-9b6f-409e-bea9-332f8ffb6e3e",
      channel: "0"
    },
    house2: {
      uuid: "c3b1c7dc-9b6f-409e-bea9-332f8ffb6e3e",
      channel: "0"
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-white shadow">
        <div className="px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Smart Home</h1>
              <HouseSelector onHouseChange={setSelectedHouse} />
            </div>
          </div>
        </div>
      </div>

      <main className="p-4">
        <div className="space-y-6">

          {/* Intercom Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-blue-900">Intercom</h2>
              <Link to="/intercom" className="text-blue-600 hover:text-blue-800 font-medium">
                Open Intercom →
              </Link>
            </div>
            <div className="p-4">
              <IntercomStream
                uuid={intercomConfigs[selectedHouse].uuid}
                channel={intercomConfigs[selectedHouse].channel}
                compact={true}
              />
            </div>
          </div>

          {/* Camera Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-green-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-green-900">Security Camera</h2>
              <Link to="/camera" className="text-green-600 hover:text-green-800 font-medium">
                View All Cameras →
              </Link>
            </div>
            <div className="p-4">
              {Object.entries(cameraConfigs[selectedHouse])[0] && (
                <IntercomStream
                  uuid={Object.entries(cameraConfigs[selectedHouse])[0][0]}
                  channel="0"
                  name={Object.entries(cameraConfigs[selectedHouse])[0][1].name}
                  compact={true}
                />
              )}
            </div>
          </div>

          {/* Parking Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-purple-50 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-purple-900">Parking</h2>
              <Link to="/parking" className="text-purple-600 hover:text-purple-800 font-medium">
                Manage Parking →
              </Link>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {cars.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No cars registered</p>
                ) : (
                  cars.map(car => (
                    <div key={car.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11h16V10l-8-3.5L4 10z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{car.model}</h3>
                        <p className="text-sm text-gray-500">{car.plateNumber}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}

export default HomePage; 