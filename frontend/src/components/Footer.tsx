
import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-8 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-accent" />
              <span className="text-lg font-bold">RentNest</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Find your perfect home with RentNest. We offer a wide range of properties to suit your needs.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-accent">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-accent">Properties</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?type=apartment" className="hover:text-accent">Apartments</Link>
              </li>
              <li>
                <Link to="/properties?type=house" className="hover:text-accent">Houses</Link>
              </li>
              <li>
                <Link to="/properties?type=commercial" className="hover:text-accent">Commercial</Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Contact Us</h3>
            <address className="text-sm not-italic text-muted-foreground">
              <p>123 Main Street</p>
              <p>San Francisco, CA 94105</p>
              <p>Email: info@rentnest.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-accent">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
