import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidators.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', protect, isAdmin, validate(createCategorySchema), categoryController.createCategory);
router.put('/:id', protect, isAdmin, validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

export default router;
