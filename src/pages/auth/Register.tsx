
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "patient",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error message when user types
    if (errorMessage) setErrorMessage(null);
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    // Clear error message when user changes role
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to register with:", formData.email);
      const { error, user: newUser } = await signUp(
        formData.email, 
        formData.password, 
        { 
          full_name: formData.name,
          phone_number: formData.phoneNumber,
          role: formData.role
        }
      );
      
      if (error) {
        console.error("Registration error:", error);
        setErrorMessage(error.message || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }
      
      console.log("Registration successful:", newUser);
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully! Please check your email for verification.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Unexpected registration error:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Simulated OAuth registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Registration Successful",
        description: `Your account has been created with ${provider}!`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: `Could not register with ${provider}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/3307970c-cd54-42a4-a45f-842a7612780c.png" 
              alt="AssistMed Logo" 
              className="h-12 w-12" 
            />
          </div>
          <h1 className="text-2xl font-bold text-indigo-800 dark:text-indigo-400">AssistMed</h1>
          <p className="text-gray-500 dark:text-gray-400">Hospital Management System</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Dr. John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@assistmed.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+91 9999999999"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  defaultValue="patient"
                  onValueChange={handleRoleChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="glass-input"
                />
              </div>
              
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full glass-button bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuthRegister("Google")}
                disabled={isLoading}
                className="w-full glass-button"
              >
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuthRegister("Facebook")}
                disabled={isLoading}
                className="w-full glass-button"
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center w-full">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline dark:text-indigo-400">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
