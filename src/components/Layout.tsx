import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size and set initial sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Always closed on mobile
      } else {
        setSidebarOpen(true); // Open by default on desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <Sidebar open={sidebarOpen} onClose={closeSidebar} isMobile={isMobile} />
      
      <div className={`transition-all duration-300 ${
        !isMobile 
          ? sidebarOpen 
            ? 'lg:ml-64' 
            : 'lg:ml-16' 
          : 'ml-0'
      }`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)] max-w-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;