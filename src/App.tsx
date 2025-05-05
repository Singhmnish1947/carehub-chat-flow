
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Create placeholder pages for all the required routes
import Taskboard from "./pages/Taskboard";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Departments from "./pages/Departments";
import Locations from "./pages/Locations";
import Medication from "./pages/Medication";
import Rooms from "./pages/Rooms";
import Staff from "./pages/Staff";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import AIChatbot from "./pages/AIChatbot";
import Xray from "./pages/Xray";
import Pharmacy from "./pages/Pharmacy";
import MinorOT from "./pages/MinorOT";
import MajorOT from "./pages/MajorOT";
import Ortho from "./pages/Ortho";
import Gyno from "./pages/Gyno";
import { AuthProvider } from "./contexts/AuthContext";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/taskboard" element={
                  <ProtectedRoute>
                    <Taskboard />
                  </ProtectedRoute>
                } />
                <Route path="/doctors" element={
                  <ProtectedRoute>
                    <Doctors />
                  </ProtectedRoute>
                } />
                <Route path="/patients" element={
                  <ProtectedRoute>
                    <Patients />
                  </ProtectedRoute>
                } />
                <Route path="/appointments" element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                } />
                <Route path="/billing" element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                } />
                <Route path="/departments" element={
                  <ProtectedRoute>
                    <Departments />
                  </ProtectedRoute>
                } />
                <Route path="/locations" element={
                  <ProtectedRoute>
                    <Locations />
                  </ProtectedRoute>
                } />
                <Route path="/medication" element={
                  <ProtectedRoute>
                    <Medication />
                  </ProtectedRoute>
                } />
                <Route path="/rooms" element={
                  <ProtectedRoute>
                    <Rooms />
                  </ProtectedRoute>
                } />
                <Route path="/staff" element={
                  <ProtectedRoute>
                    <Staff />
                  </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="/ai-chatbot" element={
                  <ProtectedRoute>
                    <AIChatbot />
                  </ProtectedRoute>
                } />
                <Route path="/xray" element={
                  <ProtectedRoute>
                    <Xray />
                  </ProtectedRoute>
                } />
                <Route path="/pharmacy" element={
                  <ProtectedRoute>
                    <Pharmacy />
                  </ProtectedRoute>
                } />
                <Route path="/minor-ot" element={
                  <ProtectedRoute>
                    <MinorOT />
                  </ProtectedRoute>
                } />
                <Route path="/major-ot" element={
                  <ProtectedRoute>
                    <MajorOT />
                  </ProtectedRoute>
                } />
                <Route path="/ortho" element={
                  <ProtectedRoute>
                    <Ortho />
                  </ProtectedRoute>
                } />
                <Route path="/gyno" element={
                  <ProtectedRoute>
                    <Gyno />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
