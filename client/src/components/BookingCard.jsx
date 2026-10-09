import { Card, CardContent, Typography, Box, Chip, Button, Stack } from '@mui/material';
import dayjs from 'dayjs';

const statusColor = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  COMPLETED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
  RESCHEDULED: 'secondary',
};

const BookingCard = ({ booking, actions }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {booking.service?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {booking.vendor?.businessName || booking.vendor?.user?.name || booking.customer?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(booking.scheduledDate).format('DD MMM YYYY, hh:mm A')}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Chip label={booking.status} color={statusColor[booking.status] || 'default'} size="small" />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            ₹{Number(booking.totalAmount).toFixed(0)}
          </Typography>
        </Box>
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {actions}
        </Stack>
      )}
    </CardContent>
  </Card>
);

export default BookingCard;
