
import React, { createContext, useContext, useState, useEffect } from "react";
import { Property, BookingInfo } from "../models/Property";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface DataContextType {
  properties: Property[];
  bookings: BookingInfo[];
  isLoading: boolean;
  searchProperties: (query: string, filters: any) => Property[];
  getProperty: (id: string) => Property | undefined;
  addProperty: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => void;
  updateProperty: (id: string, data: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  bookProperty: (propertyId: string, startDate: string, endDate: string) => void;
  getUserBookings: (userId: string) => BookingInfo[];
  getAllBookings: () => BookingInfo[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Sample data for properties
const sampleProperties: Property[] = [
  {
    id: "prop1",
    title: "Modern Downtown Apartment",
    description: "A beautiful modern apartment located in the heart of downtown with stunning city views. Features include hardwood floors, updated appliances, and a spacious balcony.",
    price: 2500,
    location: "Downtown, New York",
    type: "apartment",
    size: 850,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3",
    ],
    features: ["balcony", "air conditioning", "high-speed internet", "gym access"],
    isAvailable: true,
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 2, 1).toISOString(),
  },
  {
    id: "prop2",
    title: "Luxury Beach House",
    description: "Escape to this luxurious beach house with direct access to the ocean. Perfect for family vacations or weekend getaways.",
    price: 5000,
    location: "Malibu, California",
    type: "house",
    size: 2200,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3",
    ],
    features: ["beachfront", "private pool", "outdoor kitchen", "jacuzzi"],
    isAvailable: true,
    createdAt: new Date(2023, 0, 10).toISOString(),
    updatedAt: new Date(2023, 0, 10).toISOString(),
  },
  {
    id: "prop3",
    title: "Downtown Office Space",
    description: "Prime office space available in a prestigious business district. High ceilings, natural light, and modern amenities.",
    price: 3200,
    location: "Financial District, San Francisco",
    type: "commercial",
    size: 1200,
    bedrooms: 0,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3",
    ],
    features: ["24/7 access", "conference rooms", "kitchen area", "security system"],
    isAvailable: true,
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 2, 5).toISOString(),
  },
  {
    id: "prop4",
    title: "Cozy Suburban Home",
    description: "Family-friendly home in a peaceful suburban neighborhood. Spacious backyard, renovated kitchen, and close to schools.",
    price: 2200,
    location: "Pleasanton, California",
    type: "house",
    size: 1800,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3",
    ],
    features: ["backyard", "garage", "fireplace", "newly renovated"],
    isAvailable: true,
    createdAt: new Date(2023, 3, 20).toISOString(),
    updatedAt: new Date(2023, 3, 20).toISOString(),
  },
  {
    id: "prop5",
    title: "Urban Studio Loft",
    description: "Trendy studio loft in the arts district. Industrial chic with high ceilings and exposed brick walls.",
    price: 1800,
    location: "Arts District, Los Angeles",
    type: "apartment",
    size: 650,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?ixlib=rb-4.0.3",
    ],
    features: ["exposed brick", "industrial design", "rooftop access", "pet friendly"],
    isAvailable: true,
    createdAt: new Date(2023, 4, 5).toISOString(),
    updatedAt: new Date(2023, 4, 5).toISOString(),
  },
  {
    id: "prop6",
    title: "Retail Space in Mall",
    description: "Prime retail location in high-traffic shopping mall. Perfect for boutique or specialty store.",
    price: 4200,
    location: "Shopping District, Chicago",
    type: "commercial",
    size: 1500,
    bedrooms: 0,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1604754742629-3e5728249d73?ixlib=rb-4.0.3",
    ],
    features: ["high foot traffic", "storage room", "display windows", "security"],
    isAvailable: true,
    createdAt: new Date(2023, 5, 12).toISOString(),
    updatedAt: new Date(2023, 5, 12).toISOString(),
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load data from localStorage or use sample data
    const storedProperties = localStorage.getItem("rentnest_properties");
    const storedBookings = localStorage.getItem("rentnest_bookings");

    if (storedProperties) {
      try {
        setProperties(JSON.parse(storedProperties));
      } catch (error) {
        console.error("Error parsing properties:", error);
        // Fallback to sample data
        setProperties(sampleProperties);
      }
    } else {
      setProperties(sampleProperties);
    }

    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (error) {
        console.error("Error parsing bookings:", error);
        setBookings([]);
      }
    }

    setIsLoading(false);
  }, []);

  // Persist data changes to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("rentnest_properties", JSON.stringify(properties));
      localStorage.setItem("rentnest_bookings", JSON.stringify(bookings));
    }
  }, [properties, bookings, isLoading]);

  const searchProperties = (query: string, filters: any): Property[] => {
    let filteredProps = [...properties];

    // Search by title or location
    if (query) {
      const searchLower = query.toLowerCase();
      filteredProps = filteredProps.filter(
        (prop) =>
          prop.title.toLowerCase().includes(searchLower) ||
          prop.location.toLowerCase().includes(searchLower) ||
          prop.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters) {
      // Filter by type
      if (filters.type && filters.type !== "all") {
        filteredProps = filteredProps.filter((prop) => prop.type === filters.type);
      }

      // Filter by price range
      if (filters.minPrice !== undefined) {
        filteredProps = filteredProps.filter((prop) => prop.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        filteredProps = filteredProps.filter((prop) => prop.price <= filters.maxPrice);
      }

      // Filter by bedrooms
      if (filters.bedrooms !== undefined) {
        filteredProps = filteredProps.filter((prop) => prop.bedrooms >= filters.bedrooms);
      }

      // Filter by location (if different from search query)
      if (filters.location && filters.location !== query) {
        const locationLower = filters.location.toLowerCase();
        filteredProps = filteredProps.filter((prop) =>
          prop.location.toLowerCase().includes(locationLower)
        );
      }
    }

    return filteredProps;
  };

  const getProperty = (id: string): Property | undefined => {
    return properties.find((prop) => prop.id === id);
  };

  const addProperty = (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProperties((prevProperties) => [...prevProperties, newProperty]);
    toast.success("Property added successfully");
  };

  const updateProperty = (id: string, data: Partial<Property>) => {
    setProperties((prevProperties) =>
      prevProperties.map((prop) =>
        prop.id === id
          ? { ...prop, ...data, updatedAt: new Date().toISOString() }
          : prop
      )
    );
    toast.success("Property updated successfully");
  };

  const deleteProperty = (id: string) => {
    setProperties((prevProperties) =>
      prevProperties.filter((prop) => prop.id !== id)
    );
    
    // Also remove any bookings for this property
    setBookings((prevBookings) => 
      prevBookings.filter((booking) => booking.propertyId !== id)
    );
    
    toast.success("Property deleted successfully");
  };

  const bookProperty = (propertyId: string, startDate: string, endDate: string) => {
    if (!user) {
      toast.error("You must be logged in to book a property");
      return;
    }

    const property = getProperty(propertyId);
    if (!property) {
      toast.error("Property not found");
      return;
    }

    if (!property.isAvailable) {
      toast.error("This property is not available for booking");
      return;
    }

    // Calculate total price (simplified)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = property.price * days;

    const newBooking: BookingInfo = {
      id: `booking-${Date.now()}`,
      propertyId,
      userId: user.id,
      startDate,
      endDate,
      totalPrice,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    setBookings((prevBookings) => [...prevBookings, newBooking]);
    
    // Update property availability
    updateProperty(propertyId, { isAvailable: false });
    
    toast.success("Booking confirmed!");
  };

  const getUserBookings = (userId: string): BookingInfo[] => {
    return bookings.filter((booking) => booking.userId === userId);
  };

  const getAllBookings = (): BookingInfo[] => {
    return bookings;
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        bookings,
        isLoading,
        searchProperties,
        getProperty,
        addProperty,
        updateProperty,
        deleteProperty,
        bookProperty,
        getUserBookings,
        getAllBookings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
