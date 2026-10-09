import { Box, Paper, Typography, TextField, Button, Alert, Link as MuiLink } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../redux/api/authApi.js';
import { setCredentials } from '../redux/slices/authSlice.js';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const dashboardPathByRole = { CUSTOMER: '/customer', VENDOR: '/vendor', ADMIN: '/admin' };

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const res = await login(formData).unwrap();
      dispatch(setCredentials(res.data));
      toast.success('Welcome back!');
      navigate(dashboardPathByRole[res.data.user.role] || '/');
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Log in to manage your bookings
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.data?.message || 'Login failed'}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Box textAlign="right" sx={{ mb: 2 }}>
            <MuiLink component={Link} to="/forgot-password" variant="body2">
              Forgot password?
            </MuiLink>
          </Box>
          <Button fullWidth variant="contained" type="submit" disabled={isLoading} size="large">
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/register">
            Sign up
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
