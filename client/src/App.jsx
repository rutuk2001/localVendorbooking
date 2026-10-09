import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';

import { getTheme } from './theme/theme.js';
import MainLayout from './layouts/MainLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import VendorListPage from './pages/VendorListPage.jsx';
import VendorProfilePage from './pages/VendorProfilePage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import MyBookings from './pages/customer/MyBookings.jsx';

import VendorDashboard from './pages/vendor/VendorDashboard.jsx';
import ManageServices from './pages/vendor/ManageServices.jsx';
import VendorBookings from './pages/vendor/VendorBookings.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import ManageCategories from './pages/admin/ManageCategories.jsx';

const customerMenu = [
  { path: '/customer', label: 'Overview', icon: <DashboardIcon /> },
  { path: '/customer/bookings', label: 'My Bookings', icon: <EventNoteIcon /> },
];

const vendorMenu = [
  { path: '/vendor', label: 'Overview', icon: <DashboardIcon /> },
  { path: '/vendor/services', label: 'Services', icon: <BuildIcon /> },
  { path: '/vendor/bookings', label: 'Bookings', icon: <EventNoteIcon /> },
];

const adminMenu = [
  { path: '/admin', label: 'Overview', icon: <DashboardIcon /> },
  { path: '/admin/users', label: 'Users', icon: <PeopleIcon /> },
  { path: '/admin/categories', label: 'Categories', icon: <CategoryIcon /> },
];

function App() {
  const mode = useSelector((state) => state.ui.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/vendors" element={<VendorListPage />} />
          <Route path="/vendors/:id" element={<VendorProfilePage />} />

          <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
            <Route path="/book/:serviceId" element={<BookingPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
          <Route element={<DashboardLayout menuItems={customerMenu} title="Customer" />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<MyBookings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['VENDOR']} />}>
          <Route element={<DashboardLayout menuItems={vendorMenu} title="Vendor" />}>
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/services" element={<ManageServices />} />
            <Route path="/vendor/bookings" element={<VendorBookings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout menuItems={adminMenu} title="Admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
