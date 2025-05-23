
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Property } from "../models/Property";
import PropertyCard from "../components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const { properties } = useData();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Select a few available properties for featured section
    const available = properties.filter((p) => p.isAvailable);
    setFeaturedProperties(available.slice(0, 3));
  }, [properties]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 z-0"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-[-1]" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop')",
            backgroundBlendMode: "multiply" 
          }}
        ></div>
        
        <div className="container relative z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center max-w-3xl">
            Find Your Perfect Home with RentNest
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-6 text-center max-w-2xl">
            Discover a wide range of properties to rent, from cozy apartments to spacious houses and prime commercial spaces.
          </p>
          
          <div className="w-full max-w-md mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 pl-12 rounded-lg border-0 focus:ring-2 focus:ring-accent"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Link to={`/properties?q=${searchQuery}`}>
                <Button className="absolute right-2 top-2" size="sm">
                  Search
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/properties?type=apartment">
              <Button variant="secondary" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Apartments
              </Button>
            </Link>
            <Link to="/properties?type=house">
              <Button variant="secondary" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Houses
              </Button>
            </Link>
            <Link to="/properties?type=commercial">
              <Button variant="secondary" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Commercial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Properties</h2>
            <Link to="/properties" className="flex items-center text-accent hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Properties</h3>
              <p className="text-muted-foreground">
                Browse our extensive collection of properties and use filters to find your perfect match.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose & Book</h3>
              <p className="text-muted-foreground">
                Select the property you like, view detailed information, and book it online.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Move In</h3>
              <p className="text-muted-foreground">
                Complete the paperwork, and get ready to move into your new home!
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button asChild size="lg">
              <Link to="/properties">Explore Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/CTA */}
      <section className="py-16 bg-accent/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who found their dream properties through RentNest.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
