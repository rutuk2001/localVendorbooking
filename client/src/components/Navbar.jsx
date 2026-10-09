import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logout } from '../redux/slices/authSlice.js';
import { toggleThemeMode } from '../redux/slices/uiSlice.js';

const dashboardPathByRole = { CUSTOMER: '/customer', VENDOR: '/vendor', ADMIN: '/admin' };

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const mode = useSelector((state) => state.ui.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'primary.main', fontWeight: 800 }}
        >
          LocalVendor
        </Typography>

        <Button component={Link} to="/vendors" color="inherit" sx={{ mr: 1 }}>
          Browse Vendors
        </Button>

        <IconButton onClick={() => dispatch(toggleThemeMode())} sx={{ mr: 1 }}>
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>

        {isAuthenticated ? (
          <>
            <IconButton sx={{ mr: 1 }}>
              <Badge color="secondary" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar src={user?.avatarUrl} sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}>
                {user?.name?.[0]}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  navigate(dashboardPathByRole[user?.role] || '/');
                }}
              >
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" sx={{ mr: 1 }}>
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
