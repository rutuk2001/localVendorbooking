import { Box, Typography, Switch } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { useListUsersQuery, useToggleUserActiveMutation } from '../../redux/api/adminApi.js';

const ManageUsers = () => {
  const { data, isLoading } = useListUsersQuery();
  const [toggleActive] = useToggleUserActiveMutation();

  const handleToggle = async (id) => {
    try {
      await toggleActive(id).unwrap();
      toast.success('User status updated');
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.3 },
    { field: 'role', headerName: 'Role', width: 110 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (
        <Switch checked={params.value} onChange={() => handleToggle(params.row.id)} size="small" />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Manage Users
      </Typography>
      <Box sx={{ height: 520, bgcolor: 'background.paper', borderRadius: 2 }}>
        <DataGrid
          rows={data?.data || []}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>
    </Box>
  );
};

export default ManageUsers;
