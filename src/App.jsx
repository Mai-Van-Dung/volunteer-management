import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import UserManagement from './pages/UserManagement';
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AddEvent from "./pages/AddEvent";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import VolunteerManagement from "./pages/VolunteerManagement";
import EventRegistrations from "./pages/EventRegistrations";
import AllVolunteers from "./pages/AllVolunteers";
import Chat from "./pages/Chat";
import ChatList from "./pages/ChatList";
import AdminOrganizerRequests from "./pages/AdminOrganizerRequests";
import ApplyOrganizer from "./pages/ApplyOrganizer";
import VolunteerHistory from "./pages/VolunteerHistory";
function App() {
  // Lấy user từ localStorage (nếu đã đăng nhập)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <Router>
      <div className="font-sans">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          {!user ? (
            // Nếu chưa đăng nhập, chuyển mọi route khác về /login
            <Route path="*" element={<Navigate to="/login" replace />} />
          ) : (
            <>
              <Route path="/" element={<Hero />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
              <Route path="/admin/user-management" element={<UserManagement />} />
              <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
              <Route path="/organizer/add-event" element={<AddEvent />} />
              <Route path="/organizer/events/:id" element={<EventDetails />} />
              <Route path="/organizer/events/edit/:id" element={<EditEvent />} />
              <Route path="/volunteer/events/:id" element={<EventDetails />} />
              <Route path="/organizer/volunteers/:id" element={<VolunteerManagement />} />
              <Route path="/organizer/events/:eventId/registrations" element={<EventRegistrations />} />
              <Route path="/organizer/volunteers" element={<AllVolunteers />} />
              <Route path="/organizer/messages" element={<ChatList user={user} />} />
              <Route path="/chat" element={<ChatList user={user} />} />
              <Route path="/organizer/messages/:volunteerId" element={<Chat user={user} />} />
              <Route path="/chat/:organizerId" element={<Chat user={user} />} />
              <Route path="/volunteer/apply-organizer" element={<ApplyOrganizer />} />
              <Route path="/admin/organizer-requests" element={<AdminOrganizerRequests />} />
              <Route path="/volunteer/history" element={<VolunteerHistory />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;