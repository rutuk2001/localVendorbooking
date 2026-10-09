import { Box, Typography, Grid, Card, CardContent, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGetDashboardStatsQuery } from '../../redux/api/adminApi.js';

const COLORS = ['#1F6FEB', '#22A65B', '#F5A623', '#E5484D', '#8B5CF6', '#64748B'];

const StatCard = ({ label, value }) => (
  <Card>
    <CardContent>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={800}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading || !stats) {
    return <Skeleton variant="rounded" height={400} />;
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Platform Overview
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Total Users" value={stats.totalUsers} />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Vendors" value={stats.totalVendors} />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Customers" value={stats.totalCustomers} />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Pending Approvals" value={stats.pendingVendors} />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toFixed(0)}`} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Revenue Trend (30 days)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.revenueTrend}>
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#1F6FEB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Bookings by Status
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={stats.bookingsByStatus} dataKey="count" nameKey="status" outerRadius={90} label>
                    {stats.bookingsByStatus.map((entry, index) => (
                      <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
