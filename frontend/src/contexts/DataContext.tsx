import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Property, BookingInfo } from "../models/Property";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface DataContextType {
  properties: Property[];
  bookings: BookingInfo[];
  isLoading: boolean;
  fetchProperties: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  addProperty: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  bookProperty: (propertyId: string, startDate: string, endDate: string) => Promise<void>;
  approveBooking: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  checkAvailability: (propertyId: string, startDate: string, endDate: string) => Promise<boolean>;
  getUserBookings: () => BookingInfo[];
  getAllBookings: () => BookingInfo[];
  getProperty: (id: string) => Property | undefined;
  searchProperties: (query: string, filters: Record<string, unknown>) => Property[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch all properties from backend
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/estate`);
      const data = await res.json();
      // Map _id to id for frontend compatibility
      const mapped = Array.isArray(data)
        ? data.map((p) => ({ ...p, id: p._id }))
        : [];
      setProperties(mapped);
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  // Fetch bookings (user or admin)
  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("rentnest_token");
      const url = isAdmin ? `${API_BASE}/booking` : `${API_BASE}/booking/my`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Map _id to id for frontend compatibility
      const mapped = Array.isArray(data)
        ? data.map((b) => ({ ...b, id: b._id || b.id }))
        : [];
      setBookings(mapped);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, user, isAdmin]);

  // Add a new property (admin)
  const addProperty = async (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("rentnest_token");
      const res = await fetch(`${API_BASE}/estate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(property),
      });
      if (!res.ok) throw new Error("Failed to add property");
      toast.success("Property added successfully");
      await fetchProperties();
    } catch (error) {
      toast.error("Failed to add property");
    } finally {
      setIsLoading(false);
    }
  };

  // Update a property (admin)
  const updateProperty = async (id: string, data: Partial<Property>) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("rentnest_token");
      const res = await fetch(`${API_BASE}/estate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update property");
      toast.success("Property updated successfully");
      await fetchProperties();
    } catch (error) {
      toast.error("Failed to update property");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a property (admin)
  const deleteProperty = async (id: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("rentnest_token");
      const res = await fetch(`${API_BASE}/estate/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete property");
      toast.success("Property deleted successfully");
      await fetchProperties();
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setIsLoading(false);
    }
  };

  // Book a property (user)
  const bookProperty = async (propertyId: string, startDate: string, endDate: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("rentnest_token");
      // Find property price
      const property = properties.find((p) => p.id === propertyId);
      if (!property) throw new Error("Property not found");
      const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = property.price * days;
      const res = await fetch(`${API_BASE}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estateId: propertyId, startDate, endDate, totalPrice }),
      });
      if (!res.ok) throw new Error("Failed to book property");
      toast.success("Booking request sent (pending approval)");
      await fetchBookings();
      await fetchProperties();
    } catch (error) {
      toast.error("Failed to book property");
    } finally {
      setIsLoading(false);
    }
  };

  // Approve a booking (admin)
  const approveBooking = async (bookingId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("rentnest_token");
      const res = await fetch(`${API_BASE}/booking/${bookingId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve booking");
      toast.success("Booking approved");
      await fetchBookings();
      await fetchProperties();
    } catch (error) {
      toast.error("Failed to approve booking");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel a booking (user or admin)
  const cancelBooking = async (bookingId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("rentnest_token");
      const res = await fetch(`${API_BASE}/booking/${bookingId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      toast.success("Booking cancelled");
      await fetchBookings();
      await fetchProperties();
    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  };

  // Check property availability
  const checkAvailability = async (propertyId: string, startDate: string, endDate: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/booking/availability/${propertyId}?startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();
      return data.isAvailable;
    } catch (error) {
      console.error("Failed to check availability:", error);
      return false;
    }
  };

  // Helper: get property by id (support both id and _id)
  const getProperty = (id: string): Property | undefined => {
    return properties.find((prop) => (prop as unknown as { id?: string; _id?: string }).id === id || (prop as unknown as { id?: string; _id?: string })._id === id);
  };

  // Helper: search properties
  const searchProperties = (query: string, filters: Record<string, unknown>): Property[] => {
    let filteredProps = [...properties];
    if (query) {
      const searchLower = query.toLowerCase();
      filteredProps = filteredProps.filter(
        (prop) =>
          prop.title.toLowerCase().includes(searchLower) ||
          prop.location.toLowerCase().includes(searchLower) ||
          prop.description.toLowerCase().includes(searchLower)
      );
    }
    if (filters) {
      if ((filters.type as string) && filters.type !== "all") {
        filteredProps = filteredProps.filter((prop) => prop.type === filters.type);
      }
      if (filters.minPrice !== undefined) {
        filteredProps = filteredProps.filter((prop) => prop.price >= (filters.minPrice as number));
      }
      if (filters.maxPrice !== undefined) {
        filteredProps = filteredProps.filter((prop) => prop.price <= (filters.maxPrice as number));
      }
      if (filters.bedrooms !== undefined) {
        filteredProps = filteredProps.filter((prop) => prop.bedrooms >= (filters.bedrooms as number));
      }
      if ((filters.location as string) && filters.location !== query) {
        const locationLower = (filters.location as string).toLowerCase();
        filteredProps = filteredProps.filter((prop) =>
          prop.location.toLowerCase().includes(locationLower)
        );
      }
    }
    return filteredProps;
  };

  // Fix getUserBookings to not use .user
  const getUserBookings = () => {
    if (!user) return [];
    // Filter bookings by user ID - handle both userId and user fields
    return bookings.filter((b) => {
      const bookingUserId = (b as unknown as { userId?: string; user?: string | { _id?: string; id?: string } }).userId;
      const bookingUser = (b as unknown as { userId?: string; user?: string | { _id?: string; id?: string } }).user;

      if (bookingUserId) {
        return bookingUserId === user.id;
      }

      if (typeof bookingUser === 'string') {
        return bookingUser === user.id;
      }

      if (typeof bookingUser === 'object' && bookingUser) {
        return bookingUser._id === user.id || bookingUser.id === user.id;
      }

      return false;
    });
  };

  // Get all bookings (admin)
  const getAllBookings = () => bookings;

  // Fetch data on login or when user/admin changes
  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchBookings();
    }
  }, [user, isAdmin, fetchProperties, fetchBookings]);

  const value: DataContextType = {
    properties,
    bookings,
    isLoading,
    fetchProperties,
    fetchBookings,
    addProperty,
    updateProperty,
    deleteProperty,
    bookProperty,
    approveBooking,
    cancelBooking,
    checkAvailability,
    getUserBookings,
    getAllBookings,
    getProperty,
    searchProperties,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
