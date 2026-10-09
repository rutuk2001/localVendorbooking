import { Box, Typography, Button, Grid, Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../redux/api/categoryApi.js';

const ManageCategories = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleCreate = async () => {
    try {
      await createCategory(form).unwrap();
      toast.success('Category created');
      setOpen(false);
      setForm({ name: '', description: '' });
    } catch (err) {
      toast.error(err?.data?.message || 'Create failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deactivated');
    } catch (err) {
      toast.error(err?.data?.message || 'Delete failed');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Manage Categories
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Category
        </Button>
      </Box>

      <Grid container spacing={2}>
        {!isLoading &&
          (categories || []).map((cat) => (
            <Grid item xs={12} sm={6} md={4} key={cat.id}>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography fontWeight={700}>{cat.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cat._count?.services || 0} services
                    </Typography>
                  </Box>
                  <IconButton onClick={() => handleDelete(cat.id)}>
                    <DeleteIcon color="error" fontSize="small" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={creating} onClick={handleCreate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCategories;
