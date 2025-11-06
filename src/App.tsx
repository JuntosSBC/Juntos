import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import GroupPage from "./pages/GroupPage";
import GroupInfoPage from "./pages/GroupInfoPage";
import ProfilePage from "./pages/ProfilePage";
import PsychologistDashboard from "./pages/PsychologistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/psychologist-dashboard" element={<PsychologistDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUserManagementPage />} />
      <Route path="/group/:groupId" element={<GroupPage />} />
      <Route path="/group/:groupId/info" element={<GroupInfoPage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;