
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Create placeholder pages for all the required routes
import Taskboard from "./pages/Taskboard";
import Inbox from "./pages/Inbox";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Payments from "./pages/Payments";
import Departments from "./pages/Departments";
import Locations from "./pages/Locations";
import Medication from "./pages/Medication";
import Rooms from "./pages/Rooms";
import Staff from "./pages/Staff";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import AIChatbot from "./pages/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/taskboard" element={<Taskboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/medication" element={<Medication />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-chatbot" element={<AIChatbot />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
