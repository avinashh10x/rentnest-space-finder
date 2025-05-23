
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-16 flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button onClick={() => navigate("/")}>
            Return to Home
          </Button>
          <Button variant="outline" onClick={() => navigate("/properties")}>
            Browse Properties
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
