import { Bell, Menu, Search, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  return (
    <header className="border-b border-gray-200 bg-white h-16 flex items-center px-3 sm:px-4 sticky top-0 z-30">
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-2 sm:mr-4 text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-200 hover:scale-105" 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Mobile title - visible only on small screens */}
      <div className="flex items-center lg:hidden">
        <h1 className="text-lg font-semibold text-black">FinanceTrack</h1>
      </div>
      
      {/* <div className="relative max-w-md w-full hidden md:flex items-center">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          type="search" 
          placeholder="Search..." 
          className="pl-8 bg-gray-50 border-gray-300 w-full focus:ring-2 focus:ring-black focus:border-black"
        />
      </div> */}
      
      <div className="ml-auto flex items-center gap-3">
        {/* <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black hover:bg-gray-100">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black hover:bg-gray-100">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className="bg-black text-white">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar> */}
      </div>
    </header>
  );
};

export default Navbar;