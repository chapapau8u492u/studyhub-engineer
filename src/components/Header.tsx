
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserCircle, Search, Bell, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">StudyHub</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 ml-10">
            <a href="/" className="text-gray-700 hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">My Notes</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Discussions</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">About</a>
          </nav>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative w-64">
            <Input 
              type="text" 
              placeholder="Search notes..." 
              className="pl-9 pr-4" 
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a href="/" className="text-gray-700 hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">My Notes</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Discussions</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">About</a>
          </nav>
          
          <div className="mt-4 relative">
            <Input 
              type="text" 
              placeholder="Search notes..." 
              className="pl-9 pr-4 w-full" 
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex mt-4 space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <UserCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
