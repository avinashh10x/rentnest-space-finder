
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Property, BookingInfo } from "../models/Property";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";

interface BookingWithDetails extends BookingInfo {
  propertyTitle?: string;
  propertyLocation?: string;
  userName?: string;
  userEmail?: string;
}

const AdminPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { properties, bookings, getAllBookings, getProperty, addProperty, updateProperty, deleteProperty } = useData();
  const navigate = useNavigate();
  
  const [bookingsWithDetails, setBookingsWithDetails] = useState<BookingWithDetails[]>([]);
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: "",
    description: "",
    price: 0,
    location: "",
    type: "apartment",
    size: 0,
    bedrooms: 0,
    bathrooms: 0,
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"],
    features: [],
    isAvailable: true
  });
  const [featureInput, setFeatureInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if user is not admin
    if (!isAuthenticated || !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }

    // Get bookings with property details - user info is already in booking
    const allBookings = getAllBookings();
    const detailedBookings = allBookings.map(booking => {
      const property = getProperty(booking.propertyId);
      return {
        ...booking,
        propertyTitle: property?.title,
        propertyLocation: property?.location,
        // Use actual user info from booking if available, otherwise fallback
        userName: (booking as any).userName || "Unknown User",
        userEmail: (booking as any).userEmail || "No email"
      };
    });
    
    setBookingsWithDetails(detailedBookings);
  }, [isAuthenticated, isAdmin, navigate, getAllBookings, getProperty]);

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    
    if (editingProperty) {
      setEditingProperty({
        ...editingProperty,
        features: [...(editingProperty.features || []), featureInput.trim()]
      });
    } else {
      setNewProperty({
        ...newProperty,
        features: [...(newProperty.features || []), featureInput.trim()]
      });
    }
    
    setFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    if (editingProperty) {
      const updatedFeatures = [...editingProperty.features];
      updatedFeatures.splice(index, 1);
      setEditingProperty({
        ...editingProperty,
        features: updatedFeatures
      });
    } else {
      const updatedFeatures = [...(newProperty.features || [])];
      updatedFeatures.splice(index, 1);
      setNewProperty({
        ...newProperty,
        features: updatedFeatures
      });
    }
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    
    if (editingProperty) {
      setEditingProperty({
        ...editingProperty,
        images: [...(editingProperty.images || []), imageInput.trim()]
      });
    } else {
      setNewProperty({
        ...newProperty,
        images: [...(newProperty.images || []), imageInput.trim()]
      });
    }
    
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    if (editingProperty) {
      const updatedImages = [...editingProperty.images];
      updatedImages.splice(index, 1);
      setEditingProperty({
        ...editingProperty,
        images: updatedImages
      });
    } else {
      const updatedImages = [...(newProperty.images || [])];
      updatedImages.splice(index, 1);
      setNewProperty({
        ...newProperty,
        images: updatedImages
      });
    }
  };

  const handleCreateProperty = () => {
    const requiredFields = ["title", "description", "price", "location", "type", "size"];
    const missingFields = requiredFields.filter(field => !newProperty[field as keyof typeof newProperty]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }
    
    if (newProperty.images?.length === 0) {
      toast.error("Please add at least one image");
      return;
    }
    
    try {
      addProperty(newProperty as Omit<Property, "id" | "createdAt" | "updatedAt">);
      setNewProperty({
        title: "",
        description: "",
        price: 0,
        location: "",
        type: "apartment",
        size: 0,
        bedrooms: 0,
        bathrooms: 0,
        images: [],
        features: [],
        isAvailable: true
      });
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property");
    }
  };

  const handleStartEdit = (property: Property) => {
    setEditingProperty(property);
  };

  const handleUpdateProperty = () => {
    if (!editingProperty || !editingProperty.id) return;
    
    updateProperty(editingProperty.id, editingProperty);
    setEditingProperty(null);
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
  };

  const confirmDelete = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!propertyToDelete) return;
    
    deleteProperty(propertyToDelete);
    setPropertyToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="properties">
        <TabsList className="mb-6">
          <TabsTrigger value="properties">Manage Properties</TabsTrigger>
          <TabsTrigger value="bookings">View Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property Form */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>{editingProperty ? "Edit Property" : "Add New Property"}</CardTitle>
                <CardDescription>
                  {editingProperty ? "Update property information" : "Create a new property listing"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingProperty?.title || newProperty.title}
                    onChange={(e) => 
                      editingProperty 
                        ? setEditingProperty({...editingProperty, title: e.target.value})
                        : setNewProperty({...newProperty, title: e.target.value})
                    }
                    placeholder="e.g. Modern Downtown Apartment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingProperty?.description || newProperty.description}
                    onChange={(e) => 
                      editingProperty 
                        ? setEditingProperty({...editingProperty, description: e.target.value})
                        : setNewProperty({...newProperty, description: e.target.value})
                    }
                    placeholder="Describe the property"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($/month)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editingProperty?.price || newProperty.price}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        editingProperty 
                          ? setEditingProperty({...editingProperty, price: val})
                          : setNewProperty({...newProperty, price: val});
                      }}
                      placeholder="2500"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={editingProperty?.type || newProperty.type as string}
                      onValueChange={(val) => 
                        editingProperty 
                          ? setEditingProperty({...editingProperty, type: val as any})
                          : setNewProperty({...newProperty, type: val as any})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editingProperty?.location || newProperty.location}
                    onChange={(e) => 
                      editingProperty 
                        ? setEditingProperty({...editingProperty, location: e.target.value})
                        : setNewProperty({...newProperty, location: e.target.value})
                    }
                    placeholder="e.g. Downtown, New York"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size (sq ft)</Label>
                    <Input
                      id="size"
                      type="number"
                      value={editingProperty?.size || newProperty.size}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        editingProperty 
                          ? setEditingProperty({...editingProperty, size: val})
                          : setNewProperty({...newProperty, size: val});
                      }}
                      placeholder="850"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={editingProperty?.bedrooms || newProperty.bedrooms}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        editingProperty 
                          ? setEditingProperty({...editingProperty, bedrooms: val})
                          : setNewProperty({...newProperty, bedrooms: val});
                      }}
                      placeholder="2"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={editingProperty?.bathrooms || newProperty.bathrooms}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        editingProperty 
                          ? setEditingProperty({...editingProperty, bathrooms: val})
                          : setNewProperty({...newProperty, bathrooms: val});
                      }}
                      placeholder="1"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Features</Label>
                  <div className="flex">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="e.g. balcony, air conditioning"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2"
                      onClick={handleAddFeature}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(editingProperty?.features || newProperty.features || []).map((feature, index) => (
                      <div key={index} className="bg-secondary px-3 py-1 rounded-full text-xs flex items-center">
                        {feature}
                        <button 
                          type="button" 
                          className="ml-2 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="flex">
                    <Input
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Enter image URL"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2"
                      onClick={handleAddImage}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(editingProperty?.images || newProperty.images || []).map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Property ${index + 1}`} 
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <button 
                          type="button" 
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={editingProperty?.isAvailable ?? newProperty.isAvailable}
                    onChange={(e) => 
                      editingProperty 
                        ? setEditingProperty({...editingProperty, isAvailable: e.target.checked})
                        : setNewProperty({...newProperty, isAvailable: e.target.checked})
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="isAvailable">Available for Rent</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {editingProperty ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProperty}>
                      Update Property
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleCreateProperty} className="w-full">
                    Create Property
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Property List */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Property Listings</CardTitle>
                <CardDescription>
                  Manage your property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>${property.price.toLocaleString()}/mo</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${property.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {property.isAvailable ? "Available" : "Not Available"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStartEdit(property)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(property.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {properties.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No properties found. Create your first property.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>
                View and manage all property bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookingsWithDetails.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium">{booking.propertyTitle || "Unknown Property"}</span>
                            <p className="text-xs text-muted-foreground">{booking.propertyLocation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{booking.userName}</span>
                            <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span>{format(new Date(booking.startDate), "MMM dd, yyyy")}</span>
                            <p className="text-xs text-muted-foreground">
                              to {format(new Date(booking.endDate), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell>${booking.totalPrice.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {bookingsWithDetails.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No bookings found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
