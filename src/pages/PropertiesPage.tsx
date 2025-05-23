
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Property } from "../models/Property";
import PropertyCard from "../components/PropertyCard";
import SearchFilters from "../components/SearchFilters";
import { ScrollArea } from "@/components/ui/scroll-area";

const PropertiesPage = () => {
  const { properties, searchProperties } = useData();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const location = useLocation();

  useEffect(() => {
    // Extract search params from URL
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get("q") || "";
    const type = queryParams.get("type") || "all";
    
    setSearchQuery(q);
    setFilters({ type });
    
    // Apply initial search based on URL parameters
    handleSearch(q, { type: type !== "all" ? type : undefined });
  }, [location.search, properties]);

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setFilters(filters);
    const results = searchProperties(query, filters);
    setFilteredProperties(results);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Properties</h1>
      
      <SearchFilters onSearch={handleSearch} />
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <h3 className="text-xl font-semibold">No properties found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-muted-foreground">
            Found {filteredProperties.length} properties
            {searchQuery && (
              <span> for "{searchQuery}"</span>
            )}
          </div>
          
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default PropertiesPage;
