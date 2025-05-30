
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Home, User, LogIn, LogOut } from "lucide-react";
import { Separator } from "./ui/separator";

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold">RentNest</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 !ml-12">
            {/* <Link to="/" className="text-sm font-medium transition-colors hover:text-accent">
              Home
            </Link> */}
            <Link to="/properties" className="text-sm font-medium transition-colors hover:text-accent">
              Properties
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-accent">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-accent">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Register
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            <div className="h-6 w-6 flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-current transform transition duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block h-0.5 w-full bg-current transition duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block h-0.5 w-full bg-current transform transition duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 pt-0 bg-background border-b animate-fade-in">
          <nav className="flex flex-col space-y-3 py-2">
            <Link to="/" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Separator />
            <Link to="/properties" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Properties
            </Link>
            <Separator />
            <Link to="/about" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Separator />
            <Link to="/contact" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <Separator />
            {!user && (
              <>
                <Link to="/login" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                  Log In
                </Link>
                <Separator />
                <Link to="/register" className="text-sm font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
