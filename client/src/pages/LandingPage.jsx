import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, Avatar, Skeleton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetCategoriesQuery } from '../redux/api/categoryApi.js';
import { useGetVendorsQuery } from '../redux/api/vendorApi.js';
import VendorCard from '../components/VendorCard.jsx';

const LandingPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: vendorsRes, isLoading: vendorsLoading } = useGetVendorsQuery({ limit: 8 });

  const handleSearch = () => navigate(`/vendors?search=${encodeURIComponent(search)}`);

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1F6FEB 0%, #134FB0 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: 32, md: 48 } }} gutterBottom>
            Home services, done right.
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontWeight: 400 }}>
            Book verified local professionals for cleaning, repairs, salon and more.
          </Typography>
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 1,
              display: 'flex',
              maxWidth: 560,
              mx: 'auto',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            }}
          >
            <TextField
              fullWidth
              placeholder="What service do you need?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              variant="standard"
              InputProps={{ disableUnderline: true, sx: { px: 1.5 } }}
            />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ px: 3 }}>
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Popular Categories
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={6} sm={4} md={2} key={i}>
                  <Skeleton variant="rounded" height={100} />
                </Grid>
              ))
            : (categories || []).map((cat) => (
                <Grid item xs={6} sm={4} md={2} key={cat.id}>
                  <Card
                    sx={{ textAlign: 'center', py: 3, cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: '0.2s' } }}
                    onClick={() => navigate(`/vendors?category=${cat.id}`)}
                  >
                    <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.light' }}>{cat.name[0]}</Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      {cat.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Top Rated Vendors
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {vendorsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Skeleton variant="rounded" height={220} />
                  </Grid>
                ))
              : (vendorsRes?.data || []).map((vendor) => (
                  <Grid item xs={12} sm={6} md={3} key={vendor.id}>
                    <VendorCard vendor={vendor} />
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            ['How do I book a service?', 'Search for a category, pick a vendor, choose a time slot and confirm your booking with online payment.'],
            ['Can I cancel or reschedule?', 'Yes, pending or accepted bookings can be cancelled or rescheduled from your dashboard.'],
            ['Are vendors verified?', 'Every vendor completes a document verification and admin approval step before going live.'],
            ['How do I become a vendor?', 'Sign up with a vendor account, complete your business profile and upload verification documents.'],
          ].map(([q, a]) => (
            <Grid item xs={12} md={6} key={q}>
              <Card sx={{ p: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {q}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
