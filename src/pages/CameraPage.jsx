import React, { useState } from 'react';
import IntercomStream from '../components/IntercomStream';
import BottomNavbar from '../components/BottomNavbar';
import HouseSelector from '../components/HouseSelector';

const streams = {
  house1: {
    "33bf385c-cdf0-472e-9baf-c67871b33e9c": {
      "name": "Главный вход",
      "channels": {
        "0": {
          "url": "rtsp://admin:12345678a@10.10.100.125:554/Streaming/Channels/101",
          "on_demand": true,
          "status": 1
        },
        "1": {
          "url": "rtsp://admin:12345678a@10.10.100.125:554/Streaming/Channels/102",
          "on_demand": true
        }
      }
    },
    "c9aa33fd-c5c0-44cf-ae67-f1624b0ad18a": {
      "name": "1 Этаж лифт 01",
      "channels": {
        "0": {
          "url": "rtsp://admin:12345678a@10.10.100.140:554/Streaming/Channels/101",
          "on_demand": true
        },
        "1": {
          "url": "rtsp://admin:12345678a@10.10.100.140:554/Streaming/Channels/102",
          "on_demand": true
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
        },
        "1": {
          "url": "rtsp://admin:12345678a@10.10.100.126:554/Streaming/Channels/102",
          "on_demand": true
        }
      }
    },
    "fbcb68e8-0a04-41aa-8a4d-21d537db0383": {
      "name": "Вход 03",
      "channels": {
        "0": {
          "url": "rtsp://admin:12345678a@10.10.100.122:554/Streaming/Channels/101",
          "on_demand": true
        },
        "1": {
          "url": "rtsp://admin:12345678a@10.10.100.122:554/Streaming/Channels/102",
          "on_demand": true
        }
      }
    }
  }
};

function CameraPage() {
  const [selectedHouse, setSelectedHouse] = useState(() => {
    return localStorage.getItem('selectedHouse') || 'house1';
  });

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-white shadow">
        <div className="px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Cameras</h1>
              <HouseSelector onHouseChange={setSelectedHouse} />
            </div>
          </div>
        </div>
      </div>

      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(streams[selectedHouse]).map(([uuid, stream]) => (
            <div key={uuid} className="col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="px-3 py-2 bg-white-50 border-b">
                  <h3 className="font-medium text-gray-900">{stream.name}</h3>
                </div>
                <IntercomStream
                  uuid={uuid}
                  channel="0"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}

export default CameraPage;