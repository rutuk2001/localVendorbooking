import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: '1px solid rgba(0,0,0,0.06)', mt: 8, py: 6 }}>
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" color="primary" fontWeight={800}>
            LocalVendor
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Trusted local professionals for home services, booked in minutes.
          </Typography>
        </Grid>
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Company
          </Typography>
          <MuiLink display="block" underline="hover" color="text.secondary" href="#" sx={{ mb: 1 }}>
            About Us
          </MuiLink>
          <MuiLink display="block" underline="hover" color="text.secondary" href="#">
            Careers
          </MuiLink>
        </Grid>
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Support
          </Typography>
          <MuiLink display="block" underline="hover" color="text.secondary" href="#" sx={{ mb: 1 }}>
            Help Center
          </MuiLink>
          <MuiLink display="block" underline="hover" color="text.secondary" href="#">
            Contact
          </MuiLink>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            For Vendors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Grow your business by joining our vendor network.
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 4 }}>
        © {new Date().getFullYear()} LocalVendor. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
