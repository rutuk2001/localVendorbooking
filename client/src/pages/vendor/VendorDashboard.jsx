import { Box, Typography, Grid, Card, CardContent, Alert } from '@mui/material';
import { useGetMyVendorProfileQuery, useGetVendorEarningsQuery } from '../../redux/api/vendorApi.js';

const VendorDashboard = () => {
  const { data: profile } = useGetMyVendorProfileQuery();
  const { data: earnings } = useGetVendorEarningsQuery();

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {profile?.businessName || 'Your Business'}
      </Typography>

      {profile && !profile.isApproved && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your vendor account is pending admin approval. You can set up your profile and services in the
          meantime, but you won't appear in search results until approved.
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Total Earnings
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                ₹{(earnings?.totalEarnings || 0).toFixed(0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Completed Jobs
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {earnings?.completedCount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">
                Rating
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {profile?.ratingAvg?.toFixed(1) || '0.0'} ★
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDashboard;
