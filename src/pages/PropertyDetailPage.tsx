
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProperty, bookProperty } = useData();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(Date.now() + 86400000) // Tomorrow
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 86400000 * 7) // 1 week from now
  );

  useEffect(() => {
    if (id) {
      const propertyData = getProperty(id);
      if (propertyData) {
        setProperty(propertyData);
      } else {
        toast.error("Property not found");
        navigate("/properties");
      }
      setIsLoading(false);
    }
  }, [id, getProperty, navigate]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a property");
      navigate("/login");
      return;
    }
    
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !endDate || !property || !user) {
      toast.error("Please select valid dates");
      return;
    }

    bookProperty(
      property.id,
      format(selectedDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    );
    
    setBookingModalOpen(false);
    navigate("/profile");
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-16">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Property Not Found</h2>
          <p>The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/properties")}>Browse Properties</Button>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    if (!selectedDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - selectedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const estimatedPrice = calculateDays() * property.price;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <Badge 
              variant={property.type === "apartment" ? "outline" : property.type === "house" ? "secondary" : "default"}
              className="mt-2 md:mt-0"
            >
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-6">{property.location}</p>
          
          <Carousel className="w-full mb-6">
            <CarouselContent>
              {property.images.map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="overflow-hidden rounded-lg aspect-video">
                      <img 
                        src={image || "/placeholder.svg"} 
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="mb-6">{property.description}</p>
          
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {property.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-accent mr-2"></div>
                <span className="capitalize">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">${property.price.toLocaleString()}</h3>
                  <span className="text-muted-foreground">per month</span>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Type</p>
                    <p className="capitalize">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Size</p>
                    <p>{property.size} sq ft</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Bedrooms</p>
                    <p>{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Bathrooms</p>
                    <p>{property.bathrooms}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p>Status</p>
                    <Badge variant={property.isAvailable ? "default" : "destructive"}>
                      {property.isAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  disabled={!property.isAvailable}
                  onClick={handleBookNow}
                >
                  Rent Now
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  {property.isAvailable 
                    ? "Book this property now to secure your new home." 
                    : "This property is currently not available."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Booking Dialog */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book this property</DialogTitle>
            <DialogDescription>
              Select your move-in and move-out dates to complete the booking.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Select Move-In Date:</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Select Move-Out Date:</h4>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => !selectedDate || date <= selectedDate}
                className="rounded-md border"
              />
            </div>
            
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Duration:</span>
                <span>{calculateDays()} days</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Estimated Total:</span>
                <span>${estimatedPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetailPage;
