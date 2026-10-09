import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import Navbar from '../components/Navbar.jsx';

const drawerWidth = 240;

const DashboardLayout = ({ menuItems, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:900px)');

  const drawerContent = (
    <Box sx={{ pt: 2 }}>
      <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>
        {title}
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box display="flex" flexGrow={1}>
        {isMobile ? (
          <>
            <IconButton onClick={() => setMobileOpen(true)} sx={{ position: 'fixed', bottom: 16, left: 16, bgcolor: 'primary.main', color: '#fff', zIndex: 10 }}>
              <MenuIcon />
            </IconButton>
            <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
              <Box sx={{ width: drawerWidth }}>{drawerContent}</Box>
            </Drawer>
          </>
        ) : (
          <Drawer
            variant="permanent"
            sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', position: 'relative' } }}
          >
            {drawerContent}
          </Drawer>
        )}
        <Box component="main" flexGrow={1} p={{ xs: 2, md: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
