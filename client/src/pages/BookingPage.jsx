import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useGetServiceQuery } from '../redux/api/serviceApi.js';
import { useCreateBookingMutation } from '../redux/api/bookingApi.js';

const BookingPage = () => {
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const vendorId = location.state?.vendorId;

  const { data: service, isLoading } = useGetServiceQuery(serviceId);
  const [createBooking, { isLoading: booking, error }] = useCreateBookingMutation();

  const [scheduledDate, setScheduledDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm'));
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleConfirm = async () => {
    try {
      const res = await createBooking({
        vendorId: vendorId || service?.vendorId,
        serviceId,
        scheduledDate: new Date(scheduledDate).toISOString(),
        address,
        notes,
      }).unwrap();
      toast.success('Booking created! Waiting for vendor confirmation.');
      navigate('/customer/bookings');
    } catch (err) {
      toast.error(err?.data?.message || 'Booking failed');
    }
  };

  if (isLoading || !service) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Confirm your booking
        </Typography>
        <Typography variant="subtitle1" color="primary" fontWeight={700}>
          {service.title} — ₹{Number(service.price).toFixed(0)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {service.vendor?.businessName}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error.data?.message}</Alert>}

        <TextField
          fullWidth
          type="datetime-local"
          label="Preferred Date & Time"
          margin="normal"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Service Address"
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          fullWidth
          label="Notes (optional)"
          margin="normal"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Payment will be collected online once the vendor accepts your booking. This demo uses a
            simulated payment flow.
          </Typography>
        </Box>

        <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }} disabled={booking} onClick={handleConfirm}>
          {booking ? 'Booking...' : `Confirm Booking · ₹${Number(service.price).toFixed(0)}`}
        </Button>
      </Paper>
    </Container>
  );
};

export default BookingPage;
