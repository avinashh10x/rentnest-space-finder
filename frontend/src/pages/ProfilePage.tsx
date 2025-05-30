import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { BookingInfo, Property } from "../models/Property";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { LogOut } from "lucide-react";

interface BookingWithProperty extends BookingInfo {
  property?: Property;
}

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getUserBookings, getProperty, properties, isLoading } = useData();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user && properties.length > 0) {
      const userBookings = getUserBookings();
      const bookingsWithProperties = userBookings.map(booking => {
        // Prefer estate from booking if present, fallback to getProperty
        const estate = (booking as { estate?: Property }).estate;
        const property = estate || getProperty(booking.propertyId);
        const bookingId = (booking as { id?: string; _id?: string }).id || (booking as { id?: string; _id?: string })._id;
        return {
          ...booking,
          id: bookingId,
          property
        };
      });
      setBookings(bookingsWithProperties);
    }
  }, [isAuthenticated, user, getUserBookings, getProperty, navigate, properties, bookings]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading || properties.length === 0) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
              <p className="text-muted-foreground">{user?.email || "No email"}</p>
            </div>
          </div>

          <Button variant="outline" className="mt-4 md:mt-0" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Your Rental History</h2>
              <p className="text-muted-foreground">
                View all your current and past property bookings
              </p>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p>You haven't booked any properties yet.</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => navigate("/properties")}
                  >
                    Explore Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="md:flex">
                      {booking.property?.images && booking.property.images.length > 0 && (
                        <div className="md:w-1/3">
                          <img
                            src={booking.property.images[0]}
                            alt={booking.property?.title || "Property"}
                            className="h-48 md:h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-lg font-semibold">
                          {booking.property?.title || "Unknown Property"}
                        </h3>
                        <p className="text-muted-foreground">
                          {booking.property?.location || "Unknown location"}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Check-in</p>
                            <p>{format(new Date(booking.startDate), "MMM dd, yyyy")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Check-out</p>
                            <p>{format(new Date(booking.endDate), "MMM dd, yyyy")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="capitalize">{booking.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Price</p>
                            <p>${booking.totalPrice.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/property/${booking.propertyId}`)}
                          >
                            View Property
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="mt-1">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">User Type</label>
                    <p className="mt-1 capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="mt-1">May 23, 2025</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" disabled>
                    Edit Profile (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Account settings will be available in a future update.
                </p>
                <Button variant="outline" disabled>
                  Update Settings (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
