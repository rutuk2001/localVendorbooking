import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { useGetMyBookingsQuery } from '../../redux/api/bookingApi.js';

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: bookings } = useGetMyBookingsQuery();

  const upcoming = (bookings || []).filter((b) => ['PENDING', 'ACCEPTED', 'RESCHEDULED'].includes(b.status));
  const completed = (bookings || []).filter((b) => b.status === 'COMPLETED');

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Welcome, {user?.name}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Upcoming Bookings
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {upcoming.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Completed Services
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {completed.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Bookings
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {(bookings || []).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboard;
