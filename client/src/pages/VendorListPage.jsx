import { Container, Grid, Typography, TextField, MenuItem, Box, Skeleton, Pagination } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetVendorsQuery } from '../redux/api/vendorApi.js';
import { useGetCategoriesQuery } from '../redux/api/categoryApi.js';
import VendorCard from '../components/VendorCard.jsx';

const VendorListPage = () => {
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);

  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading } = useGetVendorsQuery({
    search: searchParams.get('search') || undefined,
    city: city || undefined,
    category: category || undefined,
    page,
    limit: 9,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Browse Vendors
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" sx={{ mb: 4 }}>
        <TextField label="City" size="small" value={city} onChange={(e) => setCity(e.target.value)} sx={{ minWidth: 200 }} />
        <TextField
          select
          label="Category"
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {(categories || []).map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={220} />
              </Grid>
            ))
          : (data?.data || []).map((vendor) => (
              <Grid item xs={12} sm={6} md={4} key={vendor.id}>
                <VendorCard vendor={vendor} />
              </Grid>
            ))}
      </Grid>

      {data?.meta?.totalPages > 1 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <Pagination count={data.meta.totalPages} page={page} onChange={(e, val) => setPage(val)} />
        </Box>
      )}

      {!isLoading && (data?.data || []).length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No vendors found matching your filters.
        </Typography>
      )}
    </Container>
  );
};

export default VendorListPage;
