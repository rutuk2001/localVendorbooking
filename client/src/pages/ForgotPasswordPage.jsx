import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { useState } from 'react';
import { useForgotPasswordMutation } from '../redux/api/authApi.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword({ email });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" px={2}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Reset your password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your email and we'll send you a reset link.
        </Typography>

        {isSuccess && <Alert severity="success" sx={{ mb: 2 }}>If that email exists, a reset link has been sent.</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button fullWidth variant="contained" type="submit" disabled={isLoading} size="large" sx={{ mt: 2 }}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
