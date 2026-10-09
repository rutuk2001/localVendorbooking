import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = () => (
  <Box display="flex" flexDirection="column" minHeight="100vh">
    <Navbar />
    <Box component="main" flexGrow={1}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

export default MainLayout;
