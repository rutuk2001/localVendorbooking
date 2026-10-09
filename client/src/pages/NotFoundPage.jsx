import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh" gap={2}>
    <Typography variant="h1" fontWeight={800} color="primary">
      404
    </Typography>
    <Typography variant="h6" color="text.secondary">
      Page not found
    </Typography>
    <Button component={Link} to="/" variant="contained">
      Back to Home
    </Button>
  </Box>
);

export default NotFoundPage;
