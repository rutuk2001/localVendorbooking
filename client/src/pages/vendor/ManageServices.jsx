import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useGetMyVendorProfileQuery } from '../../redux/api/vendorApi.js';
import { useGetCategoriesQuery } from '../../redux/api/categoryApi.js';
import { useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from '../../redux/api/serviceApi.js';
import ServiceCard from '../../components/ServiceCard.jsx';

const emptyForm = { title: '', description: '', price: '', durationMin: 60, categoryId: '' };

const ManageServices = () => {
  const { data: profile, refetch } = useGetMyVendorProfileQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [createService, { isLoading: creating }] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description || '',
      price: service.price,
      durationMin: service.durationMin,
      categoryId: service.categoryId,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form, price: Number(form.price), durationMin: Number(form.durationMin) };
      if (editingId) {
        await updateService({ id: editingId, ...payload }).unwrap();
        toast.success('Service updated');
      } else {
        await createService(payload).unwrap();
        toast.success('Service created');
      }
      setOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id).unwrap();
      toast.success('Service removed');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Delete failed');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Manage Services
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Service
        </Button>
      </Box>

      <Grid container spacing={2}>
        {(profile?.services || []).map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Box position="relative">
              <ServiceCard service={service} />
              <Box position="absolute" top={8} right={8} display="flex" gap={0.5}>
                <IconButton size="small" sx={{ bgcolor: 'background.paper' }} onClick={() => openEdit(service)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ bgcolor: 'background.paper' }} onClick={() => handleDelete(service.id)}>
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Category"
            margin="normal"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {(categories || []).map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label="Title" margin="normal" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            fullWidth
            label="Price (₹)"
            type="number"
            margin="normal"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            margin="normal"
            value={form.durationMin}
            onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={creating} onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageServices;
