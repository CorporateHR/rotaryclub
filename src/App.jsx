import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { initializeMockData } from './data/mockData';

// Auth pages
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import RegisterSuccess from './pages/auth/RegisterSuccess/RegisterSuccess';

// Member pages
import MemberHome from './pages/member/Home/Home';
import MemberDirectory from './pages/member/Directory/Directory';
import MemberMeetings from './pages/member/Meetings/Meetings';
import MeetingDetail from './pages/member/MeetingDetail/MeetingDetail';
import MemberVolunteers from './pages/member/Volunteers/Volunteers';
import VolunteerDetail from './pages/member/VolunteerDetail/VolunteerDetail';
import VolunteerSignup from './pages/member/VolunteerSignup/VolunteerSignup';
import VolunteerSignupSuccess from './pages/member/VolunteerSignupSuccess/VolunteerSignupSuccess';
import ScanQR from './pages/member/ScanQR/ScanQR';
import ScanSuccessMeeting from './pages/member/ScanSuccessMeeting/ScanSuccessMeeting';
import ScanSuccessVolunteerIn from './pages/member/ScanSuccessVolunteerIn/ScanSuccessVolunteerIn';
import ScanSuccessVolunteerOut from './pages/member/ScanSuccessVolunteerOut/ScanSuccessVolunteerOut';
import MemberProfile from './pages/member/Profile/Profile';
import EditProfile from './pages/member/EditProfile/EditProfile';
import MemberDetail from './pages/member/MemberDetail/MemberDetail';
import AddGuest from './pages/member/AddGuest/AddGuest';
import GuestAdded from './pages/member/GuestAdded/GuestAdded';

// Admin pages
import AdminHome from './pages/admin/Home/Home';
import AdminMembers from './pages/admin/Members/Members';
import AddMember from './pages/admin/AddMember/AddMember';
import AdminMemberDetail from './pages/admin/MemberDetail/MemberDetail';
import AdminMeetings from './pages/admin/Meetings/Meetings';
import CreateMeeting from './pages/admin/CreateMeeting/CreateMeeting';
import EditMeeting from './pages/admin/EditMeeting/EditMeeting';
import MeetingCreated from './pages/admin/MeetingCreated/MeetingCreated';
import ViewMeetingQR from './pages/admin/ViewMeetingQR/ViewMeetingQR';
import AdminVolunteers from './pages/admin/Volunteers/Volunteers';
import AllVolunteers from './pages/admin/AllVolunteers/AllVolunteers';
import CreateVolunteer from './pages/admin/CreateVolunteer/CreateVolunteer';
import EditVolunteer from './pages/admin/EditVolunteer/EditVolunteer';
import VolunteerCreated from './pages/admin/VolunteerCreated/VolunteerCreated';
import AdminVolunteerDetail from './pages/admin/VolunteerDetail/VolunteerDetail';
import AllEvents from './pages/admin/AllEvents/AllEvents';
import AdminAnalytics from './pages/admin/Analytics/Analytics';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/member/home" replace />;
  }

  return children;
};

// Initialize mock data
initializeMockData();

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-success" element={<RegisterSuccess />} />

      {/* Member Routes */}
      <Route
        path="/member/home"
        element={
          <ProtectedRoute>
            <MemberHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/directory"
        element={
          <ProtectedRoute>
            <MemberDirectory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/directory/:id"
        element={
          <ProtectedRoute>
            <MemberDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/meetings"
        element={
          <ProtectedRoute>
            <MemberMeetings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/meetings/:id"
        element={
          <ProtectedRoute>
            <MeetingDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/volunteers"
        element={
          <ProtectedRoute>
            <MemberVolunteers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/volunteers/:id"
        element={
          <ProtectedRoute>
            <VolunteerDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/volunteers/signup/:id"
        element={
          <ProtectedRoute>
            <VolunteerSignup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/volunteers/signup-success"
        element={
          <ProtectedRoute>
            <VolunteerSignupSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/scan-qr"
        element={
          <ProtectedRoute>
            <ScanQR />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/scan-success/meeting"
        element={
          <ProtectedRoute>
            <ScanSuccessMeeting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/scan-success/volunteer-in"
        element={
          <ProtectedRoute>
            <ScanSuccessVolunteerIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/scan-success/volunteer-out"
        element={
          <ProtectedRoute>
            <ScanSuccessVolunteerOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/profile"
        element={
          <ProtectedRoute>
            <MemberProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/add-guest/:meetingId"
        element={
          <ProtectedRoute>
            <AddGuest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/guest-added"
        element={
          <ProtectedRoute>
            <GuestAdded />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute requireAdmin>
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute requireAdmin>
            <AdminMembers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members/add"
        element={
          <ProtectedRoute requireAdmin>
            <AddMember />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members/:id"
        element={
          <ProtectedRoute requireAdmin>
            <AdminMemberDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/meetings"
        element={
          <ProtectedRoute requireAdmin>
            <AdminMeetings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/meetings/create"
        element={
          <ProtectedRoute requireAdmin>
            <CreateMeeting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/meetings/created/:id"
        element={
          <ProtectedRoute requireAdmin>
            <MeetingCreated />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/meetings/edit/:id"
        element={
          <ProtectedRoute requireAdmin>
            <EditMeeting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/meetings/qr/:id"
        element={
          <ProtectedRoute requireAdmin>
            <ViewMeetingQR />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers"
        element={
          <ProtectedRoute requireAdmin>
            <AdminVolunteers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers/all"
        element={
          <ProtectedRoute requireAdmin>
            <AllVolunteers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute requireAdmin>
            <AllEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers/create"
        element={
          <ProtectedRoute requireAdmin>
            <CreateVolunteer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers/edit/:id"
        element={
          <ProtectedRoute requireAdmin>
            <EditVolunteer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers/created/:id"
        element={
          <ProtectedRoute requireAdmin>
            <VolunteerCreated />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/volunteers/:id"
        element={
          <ProtectedRoute requireAdmin>
            <AdminVolunteerDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requireAdmin>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
