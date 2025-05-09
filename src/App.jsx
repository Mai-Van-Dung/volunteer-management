import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import AdminDashboard from './pages/AdminDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import UserManagement from './pages/UserManagement';
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AddEvent from "./backend/organizer/AddEvent";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import VolunteerManagement from "./pages/VolunteerManagement"; 

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Add the Signup route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/add-event" element={<AddEvent />} />
          <Route path="/organizer/events/:id" element={<EventDetails />} />
          <Route path="/organizer/events/edit/:id" element={<EditEvent />} />
          <Route path="/volunteer/events/:id" element={<EventDetails />} />
          <Route path="/organizer/volunteers/:id" element={<VolunteerManagement />} />
        
          </Routes>
      </div>
    </Router>
  );
}

export default App;