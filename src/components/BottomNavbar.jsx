import { Link, useLocation } from 'react-router-dom';

function BottomNavbar() {
  const location = useLocation();

  const navItems = [
    { path: '/intercom', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
    { path: '/camera', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/parking', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11h16V10l-8-3.5L4 10z' },
    { path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0">
      <div className="relative">
        {/* Center Home Button */}
        <Link
          to="/"
          className={`absolute left-1/2 -translate-x-1/2 -translate-y-6 z-10`}
        >
          <div className={`w-14 h-14 rounded-full ${
            location.pathname === '/' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          } shadow-lg flex items-center justify-center`}>
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        </Link>

        {/* Bottom Navigation Bar */}
        <div className="bg-white shadow-lg rounded-t-2xl">
          <div className="max-w-md mx-auto px-6">
            <div className="h-16">
              <div className="flex items-center justify-between h-full">
                {/* Left icons */}
                <div className="flex space-x-12">
                  {navItems.slice(0, 2).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-center ${
                        location.pathname === item.path ? 'text-blue-500' : 'text-gray-400'
                      }`}
                    >
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                    </Link>
                  ))}
                </div>

                {/* Center space */}
                <div className="w-14"></div>

                {/* Right icons */}
                <div className="flex space-x-12">
                  {navItems.slice(3).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-center ${
                        location.pathname === item.path ? 'text-blue-500' : 'text-gray-400'
                      }`}
                    >
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default BottomNavbar;