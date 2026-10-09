import { Box, Paper, Typography, TextField, Button, Alert, Link as MuiLink, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../redux/api/authApi.js';
import { setCredentials } from '../redux/slices/authSlice.js';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
});

const RegisterPage = () => {
  const [role, setRole] = useState('CUSTOMER');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    try {
      const res = await registerUser({ ...formData, role }).unwrap();
      dispatch(setCredentials(res.data));
      toast.success('Account created!');
      navigate(role === 'VENDOR' ? '/vendor' : '/customer');
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2} py={4}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 460 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Create your account
        </Typography>

        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(e, val) => val && setRole(val)}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value="CUSTOMER">I need services</ToggleButton>
          <ToggleButton value="VENDOR">I provide services</ToggleButton>
        </ToggleButtonGroup>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.data?.message || 'Registration failed'}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Full Name" margin="normal" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
          <TextField fullWidth label="Email" margin="normal" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="Phone" margin="normal" {...register('phone')} />
          {role === 'VENDOR' && (
            <TextField fullWidth label="Business Name" margin="normal" {...register('businessName')} />
          )}
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button fullWidth variant="contained" type="submit" disabled={isLoading} size="large" sx={{ mt: 2 }}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <MuiLink component={Link} to="/login">
            Log in
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
