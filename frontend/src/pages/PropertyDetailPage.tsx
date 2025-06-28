import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Property } from "../models/Property";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

// Custom styles for booked dates
const bookedDateStyles = `
  .rdp-day_selected.booked {
    background-color: #dc2626 !important;
    color: white !important;
  }
  .rdp-day.booked {
    background-color: #fca5a5 !important;
    color: #7f1d1d !important;
    font-weight: bold !important;
    border: 2px solid #dc2626 !important;
  }
  .rdp-day.booked:hover {
    background-color: #ef4444 !important;
    color: white !important;
  }
`;

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProperty, bookProperty, checkAvailability, getBookedDates } = useData();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<{ startDate: string; endDate: string; status: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(Date.now() + 86400000) // Tomorrow
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 86400000 * 7) // 1 week from now
  );

  useEffect(() => {
    const loadPropertyData = async () => {
      if (id) {
        const propertyData = getProperty(id);
        if (propertyData) {
          setProperty(propertyData);
          // Load booked dates for this property
          const dates = await getBookedDates(id);
          setBookedDates(dates);
        } else {
          toast.error("Property not found");
          navigate("/properties");
        }
        setIsLoading(false);
      }
    };

    loadPropertyData();

    // Inject custom styles for booked dates
    const styleSheet = document.createElement("style");
    styleSheet.textContent = bookedDateStyles;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup styles on unmount
      document.head.removeChild(styleSheet);
    };
  }, [id, getProperty, getBookedDates, navigate]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book a property");
      navigate("/login");
      return;
    }

    setOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !endDate || !property || !user) {
      toast.error("Please select valid dates");
      return;
    }

    // Check availability first
    const availabilityResult = await checkAvailability(
      property.id,
      format(selectedDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    );

    if (!availabilityResult.isAvailable) {
      toast.error(availabilityResult.message || "Property is not available for the selected dates. Please choose different dates.");
      return;
    }

    bookProperty(
      property.id,
      format(selectedDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    );

    setOpen(false);
    toast.success("Booking successful! View details in your profile.");
    navigate("/profile");
  };

  // Check if a date is within any booked range
  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  // Get formatted unavailable date ranges
  const getUnavailableDateRanges = (): string => {
    if (bookedDates.length === 0) return "No dates are currently unavailable.";

    return bookedDates.map(booking => {
      const start = new Date(booking.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const end = new Date(booking.endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return `${start} - ${end} (${booking.status})`;
    }).join(', ');
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

  // Booking render based on device
  const BookingUI = () => (
    <div className="space-y-6 py-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Select Move-In Date:</h4>
        <div className="flex items-center p-2 border rounded-md">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          <span>{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select date"}</span>
        </div>
        <div className="mt-2 border rounded-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || isDateBooked(date)}
            initialFocus
            modifiers={{
              booked: (date) => isDateBooked(date)
            }}
            modifiersClassNames={{
              booked: 'booked'
            }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Select Move-Out Date:</h4>
        <div className="flex items-center p-2 border rounded-md">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          <span>{endDate ? format(endDate, "MMMM d, yyyy") : "Select date"}</span>
        </div>
        <div className="mt-2 border rounded-md">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            disabled={(date) => !selectedDate || date <= selectedDate || isDateBooked(date)}
            initialFocus
            modifiers={{
              booked: (date) => isDateBooked(date)
            }}
            modifiersClassNames={{
              booked: 'booked'
            }}
          />
        </div>
      </div>

      {/* Unavailable dates info */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <h5 className="text-sm font-medium text-red-800 mb-1">Unavailable Dates:</h5>
        <p className="text-xs text-red-600">
          {getUnavailableDateRanges()}
        </p>
        <p className="text-xs text-red-500 mt-1">
          Red dates on calendar are not available for booking.
        </p>
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
  );

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

                {isDesktop ? (
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                      <Button
                        className="w-full"
                        disabled={!property.isAvailable}
                        onClick={handleBookNow}
                      >
                        Rent Now
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Book this property</SheetTitle>
                        <SheetDescription>
                          Select your move-in and move-out dates to complete the booking.
                        </SheetDescription>
                      </SheetHeader>
                      <BookingUI />
                      <SheetFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleConfirmBooking}>
                          Confirm Booking
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                      <Button
                        className="w-full"
                        disabled={!property.isAvailable}
                        onClick={handleBookNow}
                      >
                        Rent Now
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[90vh] overflow-y-auto">
                      <DrawerHeader className="text-left">
                        <DrawerTitle>Book this property</DrawerTitle>
                        <DrawerDescription>
                          Select your move-in and move-out dates to complete the booking.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        <BookingUI />
                      </div>
                      <DrawerFooter className="pt-0">
                        <div className="flex justify-end gap-2 w-full">
                          <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DrawerClose>
                          <Button onClick={handleConfirmBooking}>
                            Confirm Booking
                          </Button>
                        </div>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )}

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
    </div>
  );
};

export default PropertyDetailPage;
