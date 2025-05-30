
import React from "react";
import { Link } from "react-router-dom";
import { Property } from "../models/Property";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { id, title, location, price, type, bedrooms, bathrooms, size, images, isAvailable } = property;

  return (
    <Link to={`/property/${id}`}>
      <Card className="property-card h-full overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={images[0] || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Not Available
              </Badge>
            </div>
          )}
          <Badge 
            className="absolute top-2 right-2" 
            variant={type === "apartment" ? "outline" : type === "house" ? "secondary" : "default"}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg truncate">{title}</h3>
          <p className="text-muted-foreground text-sm mb-2">{location}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-primary font-bold">${price.toLocaleString()}/mo</p>
            <div className="text-sm text-muted-foreground">
              {bedrooms} bd | {bathrooms} ba | {size} sqft
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 border-t">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>{isAvailable ? "Available Now" : "Not Available"}</span>
            <span>View Details &rarr;</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
