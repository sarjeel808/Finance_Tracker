import { NavLink } from 'react-router-dom';
import { Home, DollarSign, Target, BookOpen, ArrowRightLeft, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar = ({ open, onClose, isMobile = false }: SidebarProps) => {
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <Home className="w-5 h-5" />
    },
    { 
      name: 'Expenses', 
      path: '/expenses', 
      icon: <ArrowRightLeft className="w-5 h-5" />
    },
    { 
      name: 'Budgets', 
      path: '/budgets', 
      icon: <Wallet className="w-5 h-5" />
    },
    { 
      name: 'Goals', 
      path: '/goals', 
      icon: <Target className="w-5 h-5" />
    },
    { 
      name: 'Resources', 
      path: '/resources', 
      icon: <BookOpen className="w-5 h-5" />
    },
  ];

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 shadow-lg",
        // Mobile behavior: slide in/out from left
        isMobile 
          ? open 
            ? "w-64 translate-x-0" 
            : "w-64 -translate-x-full"
          : // Desktop behavior: expand/collapse
            open 
              ? "w-64" 
              : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <TrendingUp className={cn(
            "w-5 h-5 text-black transition-transform duration-200",
            !open && !isMobile && "hover:scale-110"
          )} />
          {(open || isMobile) && (
            <p className="text-xl font-bold text-black">FinanceTrack</p>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="py-6">
        <nav className="space-y-2 px-3">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                "group flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200 relative",
                isActive 
                  ? "bg-black text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-black",
                !open && !isMobile && "lg:justify-center"
              )}
            >
              <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                {item.icon}
              </div>
              
              {(open || isMobile) && (
                <span className="ml-3 font-medium">
                  {item.name}
                </span>
              )}

              {/* Tooltip for collapsed state on desktop only */}
              {!open && !isMobile && (
                <div className="absolute left-16 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;