import BottomNavbar from '../components/BottomNavbar';

function ParkingPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Parking</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Parking Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Available Spots</span>
                      <span className="font-bold text-green-600">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Spots</span>
                      <span className="font-bold">20</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Your Vehicle</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Spot Number</span>
                      <span className="font-bold">A-15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vehicle Plate</span>
                      <span className="font-bold">ABC 123</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((activity) => (
                    <div key={activity} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Gate Access</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Successful
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}

export default ParkingPage;