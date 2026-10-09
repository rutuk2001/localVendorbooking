import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetVendorBookingsQuery, useUpdateBookingStatusMutation } from '../../redux/api/bookingApi.js';
import BookingCard from '../../components/BookingCard.jsx';

const tabsFilter = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'];

const VendorBookings = () => {
  const [tab, setTab] = useState(0);
  const { data: bookings, isLoading } = useGetVendorBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();

  const filtered = (bookings || []).filter((b) => tabsFilter[tab] === 'ALL' || b.status === tabsFilter[tab]);

  const handleUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Booking Requests
      </Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }} variant="scrollable">
        {tabsFilter.map((t) => (
          <Tab key={t} label={t} />
        ))}
      </Tabs>

      {!isLoading && filtered.length === 0 && <Typography color="text.secondary">No bookings here.</Typography>}

      {filtered.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          actions={
            <>
              {booking.status === 'PENDING' && (
                <>
                  <Button size="small" variant="contained" onClick={() => handleUpdate(booking.id, 'ACCEPTED')}>
                    Accept
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleUpdate(booking.id, 'REJECTED')}>
                    Reject
                  </Button>
                </>
              )}
              {booking.status === 'ACCEPTED' && (
                <Button size="small" variant="contained" color="success" onClick={() => handleUpdate(booking.id, 'COMPLETED')}>
                  Mark Complete
                </Button>
              )}
            </>
          }
        />
      ))}
    </Box>
  );
};

export default VendorBookings;
