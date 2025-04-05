
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-care-light px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-care-primary">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for cannot be found.
        </p>
        <Link to="/">
          <Button className="bg-care-primary hover:bg-care-dark">
            <ArrowLeft size={18} className="mr-2" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
