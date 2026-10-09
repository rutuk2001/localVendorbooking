import { Box, Typography, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Rating, TextField } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetMyBookingsQuery, useCancelBookingMutation } from '../../redux/api/bookingApi.js';
import { useCreateReviewMutation } from '../../redux/api/reviewApi.js';
import BookingCard from '../../components/BookingCard.jsx';

const tabsFilter = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'];

const MyBookings = () => {
  const [tab, setTab] = useState(0);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: bookings, isLoading } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [createReview, { isLoading: reviewing }] = useCreateReviewMutation();

  const filtered = (bookings || []).filter((b) => tabsFilter[tab] === 'ALL' || b.status === tabsFilter[tab]);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id).unwrap();
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err?.data?.message || 'Cancel failed');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await createReview({ bookingId: reviewTarget.id, rating, comment }).unwrap();
      toast.success('Review submitted');
      setReviewTarget(null);
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err?.data?.message || 'Review failed');
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        My Bookings
      </Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} variant="scrollable">
        {tabsFilter.map((t) => (
          <Tab key={t} label={t} />
        ))}
      </Tabs>

      {!isLoading && filtered.length === 0 && (
        <Typography color="text.secondary">No bookings in this category.</Typography>
      )}

      {filtered.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          actions={
            <>
              {['PENDING', 'ACCEPTED'].includes(booking.status) && (
                <Button size="small" color="error" variant="outlined" onClick={() => handleCancel(booking.id)}>
                  Cancel
                </Button>
              )}
              {booking.status === 'COMPLETED' && !booking.review && (
                <Button size="small" variant="contained" onClick={() => setReviewTarget(booking)}>
                  Leave a Review
                </Button>
              )}
            </>
          }
        />
      ))}

      <Dialog open={!!reviewTarget} onClose={() => setReviewTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle>Rate your experience</DialogTitle>
        <DialogContent>
          <Rating value={rating} onChange={(e, v) => setRating(v)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewTarget(null)}>Cancel</Button>
          <Button variant="contained" disabled={reviewing} onClick={handleReviewSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
