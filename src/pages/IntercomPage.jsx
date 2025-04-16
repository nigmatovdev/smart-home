import { useState } from 'react';
import BottomNavbar from '../components/BottomNavbar';

function IntercomPage() {
  const [activeCall, setActiveCall] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    apartment: '',
    accessType: 'temporary'
  });

  // Mock data for contacts
  const contacts = [
    {
      id: 1,
      name: 'John Doe',
      phone: '+1 234 567 890',
      apartment: '101',
      accessType: 'permanent',
      lastAccess: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+1 234 567 891',
      apartment: '102',
      accessType: 'temporary',
      lastAccess: '1 day ago'
    }
  ];

  const handleAddContact = () => {
    // Here you would typically make an API call to add the contact
    console.log('Adding contact:', newContact);
    setShowAddContact(false);
    setNewContact({
      name: '',
      phone: '',
      apartment: '',
      accessType: 'temporary'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Intercom</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Active Call Section */}
          {activeCall ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Active Call</h2>
                  <p className="text-gray-600">{activeCall.name}</p>
                </div>
                <div className="flex space-x-4">
                  <button className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </button>
                  <button className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-gray-600">No active calls</p>
              </div>
            </div>
          )}

          {/* Contacts Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
              <button
                onClick={() => setShowAddContact(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Contact
              </button>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.phone} • {contact.apartment}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      contact.accessType === 'permanent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contact.accessType}
                    </span>
                    <button className="text-red-500 hover:text-red-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apartment</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newContact.apartment}
                  onChange={(e) => setNewContact({ ...newContact, apartment: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Access Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newContact.accessType}
                  onChange={(e) => setNewContact({ ...newContact, accessType: e.target.value })}
                >
                  <option value="permanent">Permanent</option>
                  <option value="temporary">Temporary</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddContact(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
}

export default IntercomPage; 