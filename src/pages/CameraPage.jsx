import BottomNavbar from '../components/BottomNavbar';

function CameraPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Cameras</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Camera feed would go here */}
                <div className="flex items-center justify-center">
                  <span className="text-gray-500">Camera Feed 1</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Front Door Camera</h3>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Camera feed would go here */}
                <div className="flex items-center justify-center">
                  <span className="text-gray-500">Camera Feed 2</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Back Door Camera</h3>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavbar />
    </div>
  );
}

export default CameraPage;