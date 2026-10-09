import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ServiceCard = ({ service, onBook }) => (
  <Card sx={{ p: 1 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {service.title}
          </Typography>
          <Chip label={service.category?.name} size="small" sx={{ mt: 0.5 }} />
        </Box>
        <Typography variant="h6" color="primary" fontWeight={800}>
          ₹{Number(service.price).toFixed(0)}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {service.description}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }} color="text.secondary">
        <AccessTimeIcon fontSize="small" />
        <Typography variant="caption">{service.durationMin} min</Typography>
      </Box>
      {onBook && (
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => onBook(service)}>
          Book Now
        </Button>
      )}
    </CardContent>
  </Card>
);

export default ServiceCard;
