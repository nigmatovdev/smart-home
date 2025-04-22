import { useState, useRef } from 'react';
import BottomNavbar from '../components/BottomNavbar';
import IntercomStream from '../components/IntercomStream';

// Intercom stream configuration
const INTERCOM_CONFIG = {
  uuid: "c3b1c7dc-9b6f-409e-bea9-332f8ffb6e3e",
  channel: "0",
  id: "591d519b-fa23-43be-9f55-646f201a0e4f"
};

function IntercomPage() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAcceptingCall, setIsAcceptingCall] = useState(false);
  const [isOpeningDoor, setIsOpeningDoor] = useState(false);
  
  const acceptButtonRef = useRef(null);
  const doorButtonRef = useRef(null);

  const handleOpenDoor = async () => {
    try {
      setIsOpeningDoor(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/intercom/control-door/${INTERCOM_CONFIG.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setIsDoorOpen(true);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setIsDoorOpen(false);
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to open door');
      }
    } catch (error) {
      console.error('Error opening door:', error);
      setShowSuccessMessage(false);
      // Show error message to user
      alert('Failed to open door: ' + error.message);
    } finally {
      setIsOpeningDoor(false);
    }
  };

  const handleSwipe = (buttonRef, action, setIsSliding) => {
    const button = buttonRef.current;
    let startX = 0;
    let currentX = 0;
    const threshold = 100;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      button.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
      currentX = e.touches[0].clientX - startX;
      if (currentX > 0 && currentX < threshold) {
        button.style.transform = `translateX(${currentX}px)`;
      }
    };

    const handleTouchEnd = () => {
      button.style.transition = 'transform 0.3s ease';
      if (currentX >= threshold) {
        button.style.transform = 'translateX(100%)';
        setIsSliding(true);
        action();
        setTimeout(() => {
          button.style.transform = 'translateX(0)';
          setIsSliding(false);
        }, 1000);
      } else {
        button.style.transform = 'translateX(0)';
      }
    };

    button.addEventListener('touchstart', handleTouchStart);
    button.addEventListener('touchmove', handleTouchMove);
    button.addEventListener('touchend', handleTouchEnd);

    return () => {
      button.removeEventListener('touchstart', handleTouchStart);
      button.removeEventListener('touchmove', handleTouchMove);
      button.removeEventListener('touchend', handleTouchEnd);
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 flex flex-col">
      <div className="bg-white shadow">
        <div className="px-4">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Intercom</h1>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col justify-center">
        <div className="px-4">
          {/* Camera Stream */}
          <div className="bg-gray-800 rounded-lg shadow-lg mb-8">
            <IntercomStream
              uuid={INTERCOM_CONFIG.uuid}
              channel={INTERCOM_CONFIG.channel}
              compact={true}
            />
          </div>

          {/* Control Buttons */}
          <div className="max-w-2xs mx-auto flex justify-between">
            {/* Accept Call Button */}
            <button
              onClick={() => setIsAcceptingCall(true)}
              className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
              disabled={isAcceptingCall}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>

            {/* Open Door Button */}
            <button
              onClick={handleOpenDoor}
              className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
              disabled={isOpeningDoor || isDoorOpen}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              Door opened successfully!
            </div>
          )}
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}

export default IntercomPage; 