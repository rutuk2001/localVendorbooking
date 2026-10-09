import { Container, Grid, Typography, Box, Rating, Avatar, Tabs, Tab, Skeleton, Card, CardContent, Chip } from '@mui/material';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetVendorQuery } from '../redux/api/vendorApi.js';
import ServiceCard from '../components/ServiceCard.jsx';

const VendorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const { data: vendor, isLoading } = useGetVendorQuery(id);

  if (isLoading) {
    return (
      <Container sx={{ py: 5 }}>
        <Skeleton variant="rounded" height={200} />
      </Container>
    );
  }

  if (!vendor) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" gap={3} alignItems="center" flexWrap="wrap" sx={{ mb: 4 }}>
        <Avatar sx={{ width: 88, height: 88, bgcolor: 'primary.main', fontSize: 32 }}>
          {vendor.businessName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {vendor.businessName}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
            <Rating value={vendor.ratingAvg || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              {vendor.ratingAvg?.toFixed(1)} ({vendor.ratingCount} reviews)
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {vendor.city} {vendor.address ? `· ${vendor.address}` : ''}
          </Typography>
          {vendor.isVerified && <Chip label="Verified" color="success" size="small" sx={{ mt: 1 }} />}
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
        {vendor.description || 'This vendor has not added a description yet.'}
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Services" />
        <Tab label={`Reviews (${vendor.reviews?.length || 0})`} />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          {(vendor.services || []).map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <ServiceCard
                service={service}
                onBook={() => navigate(`/book/${service.id}`, { state: { vendorId: vendor.id } })}
              />
            </Grid>
          ))}
          {(vendor.services || []).length === 0 && (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              No active services yet.
            </Typography>
          )}
        </Grid>
      )}

      {tab === 1 && (
        <Box>
          {(vendor.reviews || []).map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={review.customer?.avatarUrl} sx={{ width: 32, height: 32 }}>
                    {review.customer?.name?.[0]}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {review.customer?.name}
                  </Typography>
                  <Rating value={review.rating} size="small" readOnly />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>
              </CardContent>
            </Card>
          ))}
          {(vendor.reviews || []).length === 0 && (
            <Typography color="text.secondary">No reviews yet.</Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default VendorProfilePage;
