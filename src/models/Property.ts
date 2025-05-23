
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'apartment' | 'house' | 'commercial';
  size: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  features: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingInfo {
  id: string;
  propertyId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
