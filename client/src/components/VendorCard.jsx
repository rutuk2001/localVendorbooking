import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const VendorCard = ({ vendor }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/vendors/${vendor.id}`)}>
        <CardMedia
          component="div"
          sx={{
            height: 140,
            bgcolor: "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          {vendor.businessName?.[0]}
        </CardMedia>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {vendor.businessName}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5} sx={{ my: 0.5 }}>
            <Rating
              value={vendor.ratingAvg || 0}
              precision={0.5}
              size="small"
              readOnly
            />
            <Typography variant="caption" color="text.secondary">
              ({vendor.ratingCount || 0})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" noWrap>
            {vendor.city || "Location not set"}
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {(vendor.services || []).slice(0, 2).map((s) => (
              <Chip
                key={s.id}
                label={s.category?.name || s.title}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VendorCard;
m;
